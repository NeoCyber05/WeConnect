from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from app.schemas.event import UserBrief


class ParticipantBrief(BaseModel):
    user_id: int
    full_name: str
    avatar_url: Optional[str] = None
    role: str

    model_config = {"from_attributes": True}


class GameRoomOut(BaseModel):
    room_id: int
    code: str
    host_id: int
    room_type: str
    max_players: int
    status: str
    created_at: datetime
    participants_count: int
    participants: List[UserBrief]

    model_config = {"from_attributes": True}


class GameRoomCreate(BaseModel):
    room_type: str = Field(default="QUIZ")
    max_players: int = Field(default=10)


class JoinRoomRequest(BaseModel):
    code: str
