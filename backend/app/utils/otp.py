import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.config import settings


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def save_otp(db: Session, identifier: str, purpose: str) -> str:
    from app.models.user import OTP

    # Vô hiệu hoá OTP cũ cùng identifier + purpose còn pending
    db.query(OTP).filter(
        OTP.identifier == identifier,
        OTP.purpose == purpose,
        OTP.used == False,
    ).update({"used": True})

    code = generate_otp()
    expire_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    otp = OTP(identifier=identifier, code=code, purpose=purpose, expire_at=expire_at)
    db.add(otp)
    db.commit()

    _send_otp(identifier, code, purpose)
    return code


def _send_otp(identifier: str, code: str, purpose: str) -> None:
    """Development: in ra console. Production: tích hợp Twilio/SendGrid."""
    label = "Đăng ký" if purpose == "REGISTER" else "Quên mật khẩu"
    print(f"\n{'='*50}")
    print(f"[OTP] {label} | {identifier}")
    print(f"      Mã OTP: {code} (hết hạn sau {settings.OTP_EXPIRE_MINUTES} phút)")
    print(f"{'='*50}\n")


def verify_otp(db: Session, identifier: str, code: str, purpose: str) -> bool:
    from app.models.user import OTP

    now = datetime.now(timezone.utc)
    otp = (
        db.query(OTP)
        .filter(
            OTP.identifier == identifier,
            OTP.code == code,
            OTP.purpose == purpose,
            OTP.used == False,
            OTP.expire_at > now,
        )
        .order_by(OTP.created_at.desc())
        .first()
    )

    if not otp:
        return False

    otp.used = True
    db.commit()
    return True
