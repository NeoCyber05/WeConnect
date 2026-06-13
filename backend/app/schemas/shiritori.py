from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.game_common import LeaderboardEntry

ScriptMode = Literal["HIRAGANA", "KATAKANA"]
TURN_SECONDS_CHOICES = (15, 20, 30, 45, 60)
MATCH_MINUTES_CHOICES = (5, 10, 15, 20, 30)

class ShiritoriRoomSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")

    script_mode: ScriptMode = "HIRAGANA"
    min_mora: int = Field(default=2, ge=1, le=12)
    max_mora: int = Field(default=8, ge=1, le=12)
    start_kana: str = Field(default="RANDOM", description="Single kana or RANDOM")
    turn_seconds: int = Field(default=30, description="Thời gian mỗi lượt (giây)")
    match_minutes: int = Field(default=10, description="Thời gian một ván (phút)")
    allow_long_vowel_chain: bool = True

    @field_validator("start_kana")
    @classmethod
    def validate_start_kana(cls, v: str) -> str:
        if v.upper() == "RANDOM":
            return "RANDOM"
        if len(v) != 1:
            raise ValueError("start_kana must be one kana or RANDOM")
        return v

    @field_validator("turn_seconds")
    @classmethod
    def validate_turn_seconds(cls, v: int) -> int:
        if v not in TURN_SECONDS_CHOICES:
            raise ValueError(f"turn_seconds must be one of {TURN_SECONDS_CHOICES}")
        return v

    @field_validator("match_minutes")
    @classmethod
    def validate_match_minutes(cls, v: int) -> int:
        if v not in MATCH_MINUTES_CHOICES:
            raise ValueError(f"match_minutes must be one of {MATCH_MINUTES_CHOICES}")
        return v

    @field_validator("max_mora")
    @classmethod
    def max_gte_min(cls, v: int, info) -> int:
        min_mora = info.data.get("min_mora", 1)
        if v < min_mora:
            raise ValueError("max_mora must be >= min_mora")
        return v


class ShiritoriHistoryEntry(BaseModel):
    user_id: int
    full_name: str
    word: str
    meaning: str
    points: int
    played_at: datetime


class ShiritoriStateOut(BaseModel):
    room_id: int
    code: str
    status: str
    host_id: int
    started_at: Optional[datetime] = None
    paused_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    server_now: datetime
    settings: ShiritoriRoomSettings
    required_kana: Optional[str] = None
    current_turn_user_id: Optional[int] = None
    turn_started_at: Optional[datetime] = None
    turn_seconds_left: int = 0
    match_seconds_left: int = 0
    used_words: List[str] = Field(default_factory=list)
    history: List[ShiritoriHistoryEntry] = Field(default_factory=list)
    leaderboard: List[LeaderboardEntry] = Field(default_factory=list)
    is_my_turn: bool = False

    model_config = {
        "from_attributes": True,
        "json_encoders": {datetime: lambda v: v.strftime("%Y-%m-%dT%H:%M:%SZ") if v else None},
    }


class ShiritoriSubmitRequest(BaseModel):
    word: str = Field(min_length=1, max_length=50)


class ShiritoriSubmitResult(BaseModel):
    valid: bool
    reason: Optional[str] = None
    word: Optional[str] = None
    meaning: Optional[str] = None
    points: int = 0
    new_score: int = 0
    next_kana: Optional[str] = None
    next_turn_user_id: Optional[int] = None
