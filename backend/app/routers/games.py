from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
import random
import string
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.game import GameRoom, GameParticipant
from app.schemas.game import GameRoomOut, GameRoomCreate, JoinRoomRequest

router = APIRouter()


def _generate_unique_code(db: Session) -> str:
    while True:
        code = "RM" + "".join(random.choices(string.digits, k=4))
        existing = db.query(GameRoom).filter(GameRoom.code == code).first()
        if not existing:
            return code


def _build_room_out(room: GameRoom, db: Session) -> dict:
    active_participants = (
        db.query(User)
        .join(GameParticipant, GameParticipant.user_id == User.user_id)
        .filter(GameParticipant.room_id == room.room_id)
        .filter(GameParticipant.left_at.is_(None))
        .all()
    )

    participants_list = []
    for p in active_participants:
        participants_list.append({
            "user_id": p.user_id,
            "full_name": p.full_name,
            "avatar_url": p.avatar_url,
        })

    return {
        "room_id": room.room_id,
        "code": room.code,
        "host_id": room.host_id,
        "room_type": room.room_type,
        "max_players": room.max_players,
        "status": room.status,
        "created_at": room.created_at,
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
