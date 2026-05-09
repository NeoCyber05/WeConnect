from app.models.user import User, Hobby, UserHobby, OTP
from app.models.event import Event, EventRegistration, EventFeedback
from app.models.friendship import FriendRequest, Friendship

__all__ = [
    "User", "Hobby", "UserHobby", "OTP",
    "Event", "EventRegistration", "EventFeedback",
    "FriendRequest", "Friendship",
]
