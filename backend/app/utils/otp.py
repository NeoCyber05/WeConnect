import random
import string
import re
import smtplib
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from sqlalchemy.orm import Session
from app.config import settings
from fastapi import HTTPException, status

_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def _is_email(identifier: str) -> bool:
    return bool(_EMAIL_RE.match(identifier))


def _has_smtp_config() -> bool:
    return bool(
        settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD
    )


def send_otp_email(identifier: str, code: str, purpose: str) -> None:
    """Gửi OTP qua email bằng SMTP."""
    if not _is_email(identifier):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP qua số điện thoại chưa được hỗ trợ. Vui lòng sử dụng email.",
        )

    if not _has_smtp_config():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Dịch vụ gửi email OTP chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
        )

    label = "Đăng ký" if purpose == "REGISTER" else "Quên mật khẩu"
    subject = f"{settings.OTP_FROM_NAME} - Mã OTP {label}"
    html_body = (
        f"<p>Mã OTP của bạn là: <strong>{code}</strong></p>"
        f"<p>Mã này sẽ hết hạn sau {settings.OTP_EXPIRE_MINUTES} phút.</p>"
    )

    msg = MIMEText(html_body, "html", "utf-8")
    msg["Subject"] = subject
    msg["From"] = settings.OTP_FROM_EMAIL
    msg["To"] = identifier

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.OTP_FROM_EMAIL, [identifier], msg.as_string())
        print(f"[SMTP] Gửi email OTP thành công đến {identifier}")
    except Exception as e:
        print(f"[SMTP] Lỗi khi gửi email OTP: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Không thể gửi email OTP. Vui lòng thử lại sau.",
        )


def save_otp(db: Session, identifier: str, purpose: str) -> str:
    from app.models.user import OTP

    last_otp = (
        db.query(OTP)
        .filter(OTP.identifier == identifier, OTP.purpose == purpose)
        .order_by(OTP.created_at.desc())
        .first()
    )
    if last_otp:
        now = datetime.now(timezone.utc)
        elapsed = now - last_otp.created_at.replace(tzinfo=timezone.utc)
        if elapsed < timedelta(minutes=4):
            remaining = 240 - int(elapsed.total_seconds())
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Vui lòng đợi {remaining} giây nữa trước khi yêu cầu mã mới.",
            )

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

    send_otp_email(identifier, code, purpose)
    return code


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
