from sqlalchemy import Column, BigInteger, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Game(Base):
    __tablename__ = "GAMES"

    game_id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    game_type = Column(String(50), nullable=False, unique=True)
    icon_bg = Column(String(50), nullable=True)
    badge_bg = Column(String(50), nullable=True)
    badge_text = Column(String(50), nullable=True)


class GameRoom(Base):
    __tablename__ = "GAME_ROOMS"

    room_id = Column(BigInteger, primary_key=True, autoincrement=True)
    code = Column(String(10), nullable=False, unique=True)
    host_id = Column(BigInteger, ForeignKey("USERS.user_id", ondelete="CASCADE"), nullable=False)
    room_type = Column(String(50), default="QUIZ")
    max_players = Column(Integer, default=10)
    status = Column(String(20), default="WAITING")  # WAITING | PLAYING | ENDED
    created_at = Column(TIMESTAMP, server_default=func.now())
    started_at = Column(TIMESTAMP, nullable=True)

    host = relationship("User", foreign_keys=[host_id])
    participants = relationship("GameParticipant", back_populates="room", cascade="all, delete-orphan")


class GameParticipant(Base):
    __tablename__ = "GAME_PARTICIPANTS"

    participant_id = Column(BigInteger, primary_key=True, autoincrement=True)
    room_id = Column(BigInteger, ForeignKey("GAME_ROOMS.room_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("USERS.user_id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(TIMESTAMP, server_default=func.now())
    left_at = Column(TIMESTAMP, nullable=True)
    score = Column(Integer, default=0)

    room = relationship("GameRoom", back_populates="participants")
    user = relationship("User")


class GameMessage(Base):
    __tablename__ = "GAME_MESSAGES"

    message_id = Column(BigInteger, primary_key=True, autoincrement=True)
    room_id = Column(BigInteger, ForeignKey("GAME_ROOMS.room_id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(BigInteger, ForeignKey("USERS.user_id", ondelete="CASCADE"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    room = relationship("GameRoom")
    sender = relationship("User")
