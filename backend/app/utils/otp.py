import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.config import settings
from fastapi import HTTPException, status
import resend

def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def save_otp(db: Session, identifier: str, purpose: str) -> str:
    from app.models.user import OTP

    # Kiểm tra cooldown: 4 phút mới được gửi tiếp (SRS ID 3, 8)
    last_otp = (
        db.query(OTP)
        .filter(OTP.identifier == identifier, OTP.purpose == purpose)
        .order_by(OTP.created_at.desc())
        .first()
    )
    if last_otp:
        now = datetime.now(timezone.utc)
        # created_at is stored in UTC
        elapsed = now - last_otp.created_at.replace(tzinfo=timezone.utc)
        if elapsed < timedelta(minutes=4):
            remaining = 240 - int(elapsed.total_seconds())
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Vui lòng đợi {remaining} giây nữa trước khi yêu cầu mã mới."
            )

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
    """Gửi OTP qua email bằng Resend."""
    label = "Đăng ký" if purpose == "REGISTER" else "Quên mật khẩu"
    print(f"\n{'='*50}")
    print(f"[OTP] {label} | {identifier}")
    print(f"      Mã OTP: {code} (hết hạn sau {settings.OTP_EXPIRE_MINUTES} phút)")
    print(f"{'='*50}\n")

    if settings.RESEND_API_KEY:
        try:
            resend.api_key = settings.RESEND_API_KEY
            subject = f"WeConnect - Mã OTP {label}"
            html_content = f"<p>Mã OTP của bạn là: <strong>{code}</strong></p><p>Mã này sẽ hết hạn sau {settings.OTP_EXPIRE_MINUTES} phút.</p>"
            
            r = resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": identifier,
                "subject": subject,
                "html": html_content
            })
            print(f"[Resend] Gửi email thành công: {r}")
        except Exception as e:
            print(f"[Resend] Lỗi khi gửi email: {e}")


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
