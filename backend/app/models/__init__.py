from app.models.user import User, Hobby, UserHobby, OTP
from app.models.event import Event, EventRegistration, EventFeedback
from app.models.friendship import FriendRequest, Friendship
from app.models.message import Conversation, Message
from app.models.game import GameRoom, GameParticipant, GameMessage

__all__ = [
    "User", "Hobby", "UserHobby", "OTP",
    "Event", "EventRegistration", "EventFeedback",
    "FriendRequest", "Friendship",
    "Conversation", "Message",
    "GameRoom", "GameParticipant", "GameMessage",
]
