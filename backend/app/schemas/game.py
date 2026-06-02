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


class RoomParticipantOut(BaseModel):
    user_id: int
    full_name: str
    avatar_url: Optional[str] = None
    score: int

    model_config = {"from_attributes": True}


class GameRoomOut(BaseModel):
    room_id: int
    code: str
    host_id: int
    room_type: str
    max_players: int
    status: str
    created_at: datetime
    started_at: Optional[datetime] = None
    participants_count: int
    participants: List[RoomParticipantOut]

    model_config = {
        "from_attributes": True,
        "json_encoders": {datetime: lambda v: v.strftime("%Y-%m-%dT%H:%M:%SZ") if v else None},
    }


class ScoreUpdateRequest(BaseModel):
    score: int


class GameRoomCreate(BaseModel):
    room_type: str = Field(default="QUIZ")
    max_players: int = Field(default=10)


class JoinRoomRequest(BaseModel):
    code: str


class GameOut(BaseModel):
    game_id: str
    name: str
    description: Optional[str] = None
    game_type: str
    icon_bg: Optional[str] = None
    badge_bg: Optional[str] = None
    badge_text: Optional[str] = None

    model_config = {"from_attributes": True}
