from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timezone
from fastapi.encoders import jsonable_encoder
import random
import string
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.game import Game, GameRoom, GameParticipant, GameMessage, GameQuestion, GameAnswer
from app.schemas.game import (
    GameOut, GameRoomOut, GameRoomCreate, JoinRoomRequest, ScoreUpdateRequest,
    AnswerRequest, AnswerResult, GameStateOut, QuestionOut, LeaderboardEntry,
    GameMessageCreate, GameMessageOut,
)
from app.utils import game_engine as ge
from app.utils.pusher import trigger_event

router = APIRouter()


def _game_channel(room_id: int) -> str:
    return f"private-game-room-{room_id}"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _leaderboard(room: GameRoom, db: Session) -> list[dict]:
    rows = (
        db.query(User, GameParticipant)
        .join(GameParticipant, GameParticipant.user_id == User.user_id)
        .filter(GameParticipant.room_id == room.room_id, GameParticipant.left_at.is_(None))
        .all()
    )
    entries = [{
        "user_id": u.user_id,
        "full_name": u.full_name,
        "avatar_url": u.avatar_url,
        "score": gp.score or 0,
        "is_ready": bool(gp.is_ready),
    } for u, gp in rows]
    entries.sort(key=lambda e: e["score"], reverse=True)
    return entries


def _broadcast(room: GameRoom, event: str, data: dict) -> None:
    trigger_event(_game_channel(room.room_id), event, jsonable_encoder(data))


def _active_participant(room_id: int, user_id: int, db: Session) -> GameParticipant | None:
    return db.query(GameParticipant).filter(
        GameParticipant.room_id == room_id,
        GameParticipant.user_id == user_id,
        GameParticipant.left_at.is_(None),
    ).first()


@router.get("", response_model=List[GameOut])
def list_games(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all games from the database."""
    return db.query(Game).all()


def _generate_unique_code(db: Session) -> str:
    while True:
        code = "RM" + "".join(random.choices(string.digits, k=4))
        existing = db.query(GameRoom).filter(GameRoom.code == code).first()
        if not existing:
            return code


def _build_room_out(room: GameRoom, db: Session) -> dict:
    active_participants = (
        db.query(User, GameParticipant)
        .join(GameParticipant, GameParticipant.user_id == User.user_id)
        .filter(GameParticipant.room_id == room.room_id)
        .filter(GameParticipant.left_at.is_(None))
        .all()
    )

    participants_list = []
    for u, gp in active_participants:
        participants_list.append({
            "user_id": u.user_id,
            "full_name": u.full_name,
            "avatar_url": u.avatar_url,
            "score": gp.score,
        })

    return {
        "room_id": room.room_id,
        "code": room.code,
        "host_id": room.host_id,
        "room_type": room.room_type,
        "max_players": room.max_players,
        "status": room.status,
        "created_at": room.created_at,
        "started_at": room.started_at,
        "participants_count": len(participants_list),
        "participants": participants_list,
    }


@router.get("/rooms", response_model=List[GameRoomOut])
def list_game_rooms(
    room_type: Optional[str] = Query(None, description="Filter by room type (CHESS, KANJI, QUIZ)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all active game rooms (status != 'ENDED')"""
    query = db.query(GameRoom).filter(GameRoom.status != "ENDED")
    if room_type:
        query = query.filter(GameRoom.room_type == room_type.upper())

    rooms = query.order_by(GameRoom.created_at.desc()).all()
    return [_build_room_out(r, db) for r in rooms]


@router.get("/rooms/code/{code}", response_model=GameRoomOut)
def get_room_by_code(
    code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get details of a specific game room by its code."""
    room = db.query(GameRoom).filter(GameRoom.code == code.upper(), GameRoom.status != "ENDED").first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng game không tồn tại hoặc đã kết thúc"
        )
    return _build_room_out(room, db)


@router.post("/rooms", status_code=status.HTTP_201_CREATED, response_model=GameRoomOut)
def create_game_room(
    body: GameRoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new game room. The creator is host and automatically joins."""
    code = _generate_unique_code(db)
    room = GameRoom(
        code=code,
        host_id=current_user.user_id,
        room_type=body.room_type.upper(),
        max_players=body.max_players,
        status="WAITING",
    )
    db.add(room)
    db.commit()
    db.refresh(room)

    participant = GameParticipant(
        room_id=room.room_id,
        user_id=current_user.user_id,
    )
    db.add(participant)
    db.commit()

    return _build_room_out(room, db)


@router.post("/rooms/join", response_model=GameRoomOut)
def join_game_room(
    body: JoinRoomRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Join an active game room by its code."""
    room = db.query(GameRoom).filter(GameRoom.code == body.code.upper(), GameRoom.status != "ENDED").first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng game không tồn tại hoặc đã kết thúc"
        )

    existing = db.query(GameParticipant).filter(
        GameParticipant.room_id == room.room_id,
        GameParticipant.user_id == current_user.user_id,
        GameParticipant.left_at.is_(None)
    ).first()

    if existing:
        return _build_room_out(room, db)

    active_count = db.query(func.count(GameParticipant.participant_id)).filter(
        GameParticipant.room_id == room.room_id,
        GameParticipant.left_at.is_(None)
    ).scalar() or 0

    if active_count >= room.max_players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phòng game đã đầy"
        )

    participant = GameParticipant(
        room_id=room.room_id,
        user_id=current_user.user_id,
    )
    db.add(participant)
    db.commit()

    _broadcast(room, "game:player-joined", {"user_id": current_user.user_id})
    return _build_room_out(room, db)


@router.post("/rooms/random", response_model=GameRoomOut)
def join_random_game_room(
    body: GameRoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Join a random WAITING room of the given type, or create one if none is available."""
    room_type_upper = body.room_type.upper()

    rooms = (
        db.query(GameRoom)
        .filter(GameRoom.room_type == room_type_upper, GameRoom.status == "WAITING")
        .order_by(GameRoom.created_at.asc())
        .all()
    )

    available_room = None
    for r in rooms:
        active_count = db.query(func.count(GameParticipant.participant_id)).filter(
            GameParticipant.room_id == r.room_id,
            GameParticipant.left_at.is_(None)
        ).scalar() or 0
        if active_count < r.max_players:
            available_room = r
            break

    if available_room:
        existing = db.query(GameParticipant).filter(
            GameParticipant.room_id == available_room.room_id,
            GameParticipant.user_id == current_user.user_id,
            GameParticipant.left_at.is_(None)
        ).first()
        if not existing:
            participant = GameParticipant(
                room_id=available_room.room_id,
                user_id=current_user.user_id,
            )
            db.add(participant)
            db.commit()
        return _build_room_out(available_room, db)

    code = _generate_unique_code(db)
    room = GameRoom(
        code=code,
        host_id=current_user.user_id,
        room_type=room_type_upper,
        max_players=body.max_players,
        status="WAITING",
    )
    db.add(room)
    db.commit()
    db.refresh(room)

    participant = GameParticipant(
        room_id=room.room_id,
        user_id=current_user.user_id,
    )
    db.add(participant)
    db.commit()

    return _build_room_out(room, db)


@router.post("/rooms/{room_id}/leave")
def leave_game_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Leave a game room. Ends room if no participants left, or changes host."""
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng game không tồn tại"
        )

    participant = db.query(GameParticipant).filter(
        GameParticipant.room_id == room_id,
        GameParticipant.user_id == current_user.user_id,
        GameParticipant.left_at.is_(None)
    ).first()

    if participant:
        participant.left_at = func.now()
        db.commit()

    active_participants = db.query(GameParticipant).filter(
        GameParticipant.room_id == room_id,
        GameParticipant.left_at.is_(None)
    ).all()

    if not active_participants:
        room.status = "ENDED"
        db.commit()
    else:
        if room.host_id == current_user.user_id:
            room.host_id = active_participants[0].user_id
            db.commit()

    _broadcast(room, "game:player-left", {"user_id": current_user.user_id})
    return {"status": "ok", "message": "Đã rời khỏi phòng thành công"}


@router.put("/rooms/{room_id}/score")
def update_room_score(
    room_id: int,
    body: ScoreUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cập nhật điểm số của người chơi trong phòng."""
    participant = db.query(GameParticipant).filter(
        GameParticipant.room_id == room_id,
        GameParticipant.user_id == current_user.user_id,
        GameParticipant.left_at.is_(None)
    ).first()
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bạn không tham gia phòng này hoặc đã rời đi"
        )

    participant.score = body.score
    db.commit()
    return {"status": "ok", "score": participant.score}


@router.post("/rooms/{room_id}/start")
def start_game_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phòng game không tồn tại")
    if room.host_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Chỉ chủ phòng mới có thể bắt đầu trận đấu")
    if room.status != "WAITING":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phòng game đã bắt đầu hoặc đã kết thúc")

    pool = db.query(GameQuestion.question_id).filter(GameQuestion.game_type == room.room_type).all()
    pool_ids = [row[0] for row in pool]
    if len(pool_ids) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chưa có câu hỏi cho loại game này")
    random.shuffle(pool_ids)
    chosen = pool_ids[: ge.TOTAL_QUESTIONS]
    # if the pool is smaller than TOTAL_QUESTIONS, repeat to fill
    while len(chosen) < ge.TOTAL_QUESTIONS:
        chosen.append(pool_ids[len(chosen) % len(pool_ids)])

    room.question_ids = chosen
    room.status = "PLAYING"
    room.started_at = _utcnow()
    room.paused_at = None
    room.ended_at = None
    db.commit()

    _broadcast(room, "game:started", {"room_id": room.room_id, "started_at": room.started_at})
    return {"status": "ok", "message": "Trận đấu đã bắt đầu thành công"}


def _visible_questions(room: GameRoom, elapsed: int, db: Session) -> list[dict]:
    """Questions from index 0..current_index. correct_index only for windows already closed."""
    if not room.question_ids:
        return []
    current = ge.question_index(elapsed)
    last = min(current, ge.TOTAL_QUESTIONS - 1)
    out: list[dict] = []
    for idx in range(0, last + 1):
        qid = room.question_ids[idx]
        q = db.query(GameQuestion).filter(GameQuestion.question_id == qid).first()
        if not q:
            continue
        window_closed = (idx < current) or (ge.seconds_into_cycle(elapsed) >= ge.ANSWER_WINDOW_SECONDS)
        out.append({
            "question_index": idx,
            "category": q.category,
            "question": q.question,
            "description": q.description,
            "options": q.options,
            "hint": q.hint,
            "correct_index": q.correct_index if window_closed else None,
        })
    return out


@router.get("/rooms/{room_id}/state", response_model=GameStateOut)
def get_game_state(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phòng game không tồn tại")

    now = _utcnow()
    if room.started_at:
        elapsed = ge.elapsed_seconds(room.started_at, room.paused_at, now)
    else:
        elapsed = 0

    # natural end
    if room.status == "PLAYING" and room.started_at and ge.match_ended(elapsed) and not room.ended_at:
        room.status = "ENDED"
        room.ended_at = now
        db.commit()
        _broadcast(room, "game:ended", {"room_id": room.room_id, "leaderboard": _leaderboard(room, db)})

    my_answers = [
        a.question_index for a in db.query(GameAnswer.question_index).filter(
            GameAnswer.room_id == room_id, GameAnswer.user_id == current_user.user_id
        ).all()
    ]

    return {
        "room_id": room.room_id,
        "code": room.code,
        "status": room.status,
        "host_id": room.host_id,
        "started_at": room.started_at,
        "paused_at": room.paused_at,
        "server_now": now,
        "total_questions": ge.TOTAL_QUESTIONS,
        "cycle_seconds": ge.CYCLE_SECONDS,
        "answer_window_seconds": ge.ANSWER_WINDOW_SECONDS,
        "current_index": ge.question_index(elapsed) if room.status == "PLAYING" else 0,
        "questions": _visible_questions(room, elapsed, db) if room.status in ("PLAYING", "ENDED") else [],
        "my_answers": my_answers,
        "leaderboard": _leaderboard(room, db),
    }


@router.post("/rooms/{room_id}/answer", response_model=AnswerResult)
def submit_answer(
    room_id: int,
    body: AnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phòng game không tồn tại")
    if room.status != "PLAYING" or room.paused_at is not None or not room.started_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Trận đấu không trong trạng thái nhận câu trả lời")

    participant = _active_participant(room_id, current_user.user_id, db)
    if not participant:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không tham gia phòng này")

    now = _utcnow()
    elapsed = ge.elapsed_seconds(room.started_at, room.paused_at, now)
    current = ge.question_index(elapsed)
    if body.question_index != current:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Câu hỏi đã chuyển sang câu khác")
    if not ge.is_answer_window_open(elapsed):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Đã hết thời gian trả lời câu này")

    qid = room.question_ids[current]
    question = db.query(GameQuestion).filter(GameQuestion.question_id == qid).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Câu hỏi không tồn tại")

    is_correct = body.selected_index == question.correct_index
    points = ge.score_for_answer(is_correct, ge.seconds_into_cycle(elapsed))

    answer = GameAnswer(
        room_id=room_id, user_id=current_user.user_id, question_index=current,
        selected_index=body.selected_index, is_correct=is_correct, points=points,
    )
    db.add(answer)
    try:
        db.flush()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Bạn đã trả lời câu này rồi")

    participant.score = (participant.score or 0) + points
    db.commit()

    _broadcast(room, "game:score", {
        "user_id": current_user.user_id, "question_index": current,
        "leaderboard": _leaderboard(room, db),
    })

    return {"is_correct": is_correct, "correct_index": question.correct_index, "points": points, "new_score": participant.score}


@router.get("/rooms/{room_id}/questions/{idx}/answer")
def reveal_answer(
    room_id: int,
    idx: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room or not room.started_at or not room.question_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phòng game không tồn tại")
    now = _utcnow()
    elapsed = ge.elapsed_seconds(room.started_at, room.paused_at, now)
    current = ge.question_index(elapsed)
    window_closed = (idx < current) or (idx == current and ge.seconds_into_cycle(elapsed) >= ge.ANSWER_WINDOW_SECONDS)
    if not window_closed:
        raise HTTPException(status_code=status.HTTP_425_TOO_EARLY, detail="Chưa đến lúc công bố đáp án")
    if idx < 0 or idx >= len(room.question_ids):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Câu hỏi không tồn tại")
    q = db.query(GameQuestion).filter(GameQuestion.question_id == room.question_ids[idx]).first()
    return {"question_index": idx, "correct_index": q.correct_index}


@router.get("/rooms/{room_id}/messages", response_model=List[GameMessageOut])
def list_game_messages(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(GameMessage, User)
        .join(User, User.user_id == GameMessage.sender_id)
        .filter(GameMessage.room_id == room_id)
        .order_by(GameMessage.message_id.desc())
        .limit(50)
        .all()
    )
    rows.reverse()
    return [{
        "message_id": m.message_id, "room_id": m.room_id, "sender_id": m.sender_id,
        "sender_name": u.full_name, "content": m.content, "created_at": m.created_at,
    } for m, u in rows]


@router.post("/rooms/{room_id}/messages", response_model=GameMessageOut)
def send_game_message(
    room_id: int,
    body: GameMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phòng game không tồn tại")
    content = (body.content or "").strip()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nội dung tin nhắn trống")
    msg = GameMessage(room_id=room_id, sender_id=current_user.user_id, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    payload = {
        "message_id": msg.message_id, "room_id": room_id, "sender_id": current_user.user_id,
        "sender_name": current_user.full_name, "content": content, "created_at": msg.created_at,
    }
    _broadcast(room, "game:message", payload)
    return payload


@router.post("/rooms/{room_id}/ready")
def toggle_ready(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    participant = _active_participant(room_id, current_user.user_id, db)
    if not participant:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không tham gia phòng này")
    participant.is_ready = not bool(participant.is_ready)
    db.commit()
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    _broadcast(room, "game:ready", {"user_id": current_user.user_id, "is_ready": participant.is_ready})
    return {"status": "ok", "is_ready": participant.is_ready}


def _require_host(room_id: int, user: User, db: Session) -> GameRoom:
    room = db.query(GameRoom).filter(GameRoom.room_id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phòng game không tồn tại")
    if room.host_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Chỉ chủ phòng mới có quyền này")
    return room


@router.post("/rooms/{room_id}/pause")
def pause_room(room_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    room = _require_host(room_id, current_user, db)
    if room.status != "PLAYING" or room.paused_at is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không thể tạm dừng lúc này")
    room.paused_at = _utcnow()
    db.commit()
    _broadcast(room, "game:paused", {"paused_at": room.paused_at})
    return {"status": "ok"}


@router.post("/rooms/{room_id}/resume")
def resume_room(room_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    room = _require_host(room_id, current_user, db)
    if room.status != "PLAYING" or room.paused_at is None or not room.started_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Trận đấu không đang tạm dừng")
    now = _utcnow()
    room.started_at = ge.resume_started_at(room.started_at, room.paused_at, now)
    room.paused_at = None
    db.commit()
    _broadcast(room, "game:resumed", {"started_at": room.started_at})
    return {"status": "ok"}


@router.post("/rooms/{room_id}/end")
def end_room(room_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    room = _require_host(room_id, current_user, db)
    if room.status == "ENDED":
        return {"status": "ok"}
    room.status = "ENDED"
    room.ended_at = _utcnow()
    db.commit()
    _broadcast(room, "game:ended", {"room_id": room.room_id, "leaderboard": _leaderboard(room, db)})
    return {"status": "ok"}
