from unittest.mock import patch, MagicMock
import pytest

from app.utils.otp import generate_otp, send_otp_email, _is_email, _has_smtp_config
from fastapi import HTTPException


# ── generate_otp ──────────────────────────────────────────────────────────────
def test_generate_otp_default_length():
    otp = generate_otp()
    assert len(otp) == 6
    assert otp.isdigit()


def test_generate_otp_custom_length():
    otp = generate_otp(4)
    assert len(otp) == 4
    assert otp.isdigit()


def test_generate_otp_randomness():
    otps = {generate_otp() for _ in range(100)}
    assert len(otps) > 1


# ── _is_email ─────────────────────────────────────────────────────────────────
def test_is_email_valid():
    assert _is_email("test@example.com") is True
    assert _is_email("user+tag@domain.co.jp") is True


def test_is_email_invalid():
    assert _is_email("not-an-email") is False
    assert _is_email("@missing-user.com") is False
    assert _is_email("missing-domain@") is False
    assert _is_email("+84912345678") is False


# ── _has_smtp_config ─────────────────────────────────────────────────────────
def test_has_smtp_config_all_set():
    with patch("app.utils.otp.settings") as mock_settings:
        mock_settings.SMTP_HOST = "smtp.gmail.com"
        mock_settings.SMTP_USER = "user@gmail.com"
        mock_settings.SMTP_PASSWORD = "pass"
        assert _has_smtp_config() is True


def test_has_smtp_config_missing():
    with patch("app.utils.otp.settings") as mock_settings:
        mock_settings.SMTP_HOST = None
        mock_settings.SMTP_USER = "user@gmail.com"
        mock_settings.SMTP_PASSWORD = "pass"
        assert _has_smtp_config() is False


# ── send_otp_email ────────────────────────────────────────────────────────────
def test_send_otp_email_missing_smtp_config_raises_503():
    with patch("app.utils.otp.settings") as mock_settings:
        mock_settings.SMTP_HOST = None
        mock_settings.SMTP_USER = None
        mock_settings.SMTP_PASSWORD = None
        with pytest.raises(HTTPException) as exc:
            send_otp_email("test@example.com", "123456", "REGISTER")
        assert exc.value.status_code == 503
        assert "chưa được cấu hình" in exc.value.detail


def test_send_otp_email_non_email_identifier_raises_400():
    with patch("app.utils.otp.settings") as mock_settings:
        mock_settings.SMTP_HOST = "smtp.gmail.com"
        mock_settings.SMTP_USER = "user@gmail.com"
        mock_settings.SMTP_PASSWORD = "pass"
        with pytest.raises(HTTPException) as exc:
            send_otp_email("+84912345678", "123456", "REGISTER")
        assert exc.value.status_code == 400
        assert "số điện thoại" in exc.value.detail.lower()


def test_send_otp_email_smtp_success():
    with patch("app.utils.otp.settings") as mock_settings, \
         patch("app.utils.otp.smtplib.SMTP") as mock_smtp:
        mock_settings.SMTP_HOST = "smtp.gmail.com"
        mock_settings.SMTP_PORT = 587
        mock_settings.SMTP_USER = "user@gmail.com"
        mock_settings.SMTP_PASSWORD = "pass"
        mock_settings.SMTP_USE_TLS = True
        mock_settings.OTP_FROM_EMAIL = "WeConnect <otp@test.com>"
        mock_settings.OTP_FROM_NAME = "WeConnect"
        mock_settings.OTP_EXPIRE_MINUTES = 5

        mock_server = MagicMock()
        mock_smtp.return_value.__enter__ = MagicMock(return_value=mock_server)
        mock_smtp.return_value.__exit__ = MagicMock(return_value=False)

        send_otp_email("test@example.com", "111111", "FORGOT_PASSWORD")

        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once_with("user@gmail.com", "pass")
        mock_server.sendmail.assert_called_once()
        args = mock_server.sendmail.call_args[0]
        assert args[0] == "WeConnect <otp@test.com>"
        assert args[1] == ["test@example.com"]
        assert "111111" in args[2]


def test_send_otp_email_smtp_exception_raises_503():
    with patch("app.utils.otp.settings") as mock_settings, \
         patch("app.utils.otp.smtplib.SMTP") as mock_smtp:
        mock_settings.SMTP_HOST = "smtp.gmail.com"
        mock_settings.SMTP_PORT = 587
        mock_settings.SMTP_USER = "user@gmail.com"
        mock_settings.SMTP_PASSWORD = "pass"
        mock_settings.SMTP_USE_TLS = True
        mock_settings.OTP_FROM_EMAIL = "WeConnect <otp@test.com>"
        mock_settings.OTP_FROM_NAME = "WeConnect"
        mock_settings.OTP_EXPIRE_MINUTES = 5

        mock_smtp.side_effect = Exception("SMTP error")

        with pytest.raises(HTTPException) as exc:
            send_otp_email("test@example.com", "123456", "REGISTER")
        assert exc.value.status_code == 503
        assert "Không thể gửi" in exc.value.detail
