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
