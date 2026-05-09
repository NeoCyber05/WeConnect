import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.user import User, Hobby, UserHobby
from app.schemas.user import (
    UserOut, UserPublicOut, HobbyOut,
    UpdateProfileRequest, UpdateHobbiesRequest, UpdateLanguageRequest, MediaUploadOut,
)
from app.config import settings

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _save_upload(file: UploadFile, subfolder: str, max_mb: int = 10) -> str:
    """Lưu file lên disk, trả về URL path."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ chấp nhận định dạng JPG, PNG, WebP",
        )

    content = file.file.read()
    if len(content) > max_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File không được vượt quá {max_mb}MB",
        )

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    folder = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(folder, exist_ok=True)

    with open(os.path.join(folder, filename), "wb") as f:
        f.write(content)

    return f"/uploads/{subfolder}/{filename}"


# ── GET /hobbies ─────────────────────────────────────────────────────────────
@router.get("/hobbies", response_model=list[HobbyOut])
def list_hobbies(db: Session = Depends(get_db)):
    """Danh sách tất cả sở thích có sẵn."""
    return db.query(Hobby).order_by(Hobby.category, Hobby.name).all()


# ── GET /users/me ─────────────────────────────────────────────────────────────
@router.get("/users/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """SRS ID 6: Xem hồ sơ cá nhân của mình."""
    return current_user


# ── PUT /users/me ─────────────────────────────────────────────────────────────
@router.put("/users/me", response_model=UserOut)
def update_my_profile(
    body: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SRS ID 6: Cập nhật hồ sơ cá nhân."""
    update_data = body.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


# ── PUT /users/me/avatar ──────────────────────────────────────────────────────
@router.put("/users/me/avatar", response_model=MediaUploadOut)
def update_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SRS ID 6: Cập nhật ảnh đại diện (≤ 5MB)."""
    url = _save_upload(file, "avatars", max_mb=5)
    current_user.avatar_url = url
    db.commit()
    return MediaUploadOut(url=url)


# ── PUT /users/me/cover ───────────────────────────────────────────────────────
@router.put("/users/me/cover", response_model=MediaUploadOut)
def update_cover(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SRS ID 6: Cập nhật ảnh bìa (≤ 10MB)."""
    url = _save_upload(file, "covers", max_mb=10)
    current_user.cover_url = url
    db.commit()
    return MediaUploadOut(url=url)


# ── PUT /users/me/language ────────────────────────────────────────────────────
@router.put("/users/me/language", status_code=status.HTTP_204_NO_CONTENT)
def update_language(
    body: UpdateLanguageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SRS ID 14: Chuyển đổi ngôn ngữ hiển thị (vi/ja). Lưu trạng thái cho lần sau."""
    current_user.preferred_language = body.language
    db.commit()


# ── GET /users/me/hobbies ─────────────────────────────────────────────────────
@router.get("/users/me/hobbies", response_model=list[HobbyOut])
def get_my_hobbies(current_user: User = Depends(get_current_user)):
    """SRS ID 6: Xem danh sách sở thích của mình."""
    return current_user.hobbies


# ── PUT /users/me/hobbies ─────────────────────────────────────────────────────
@router.put("/users/me/hobbies", response_model=list[HobbyOut])
def update_my_hobbies(
    body: UpdateHobbiesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SRS ID 6: Cập nhật danh sách sở thích. Thay thế toàn bộ danh sách cũ."""
    # Xoá hết sở thích cũ
    db.query(UserHobby).filter(UserHobby.user_id == current_user.user_id).delete()

    # Kiểm tra hobby_ids hợp lệ
    hobbies = db.query(Hobby).filter(Hobby.hobby_id.in_(body.hobby_ids)).all()
    found_ids = {h.hobby_id for h in hobbies}
    invalid = set(body.hobby_ids) - found_ids
    if invalid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Sở thích không tồn tại: {list(invalid)}",
        )

    for hobby_id in body.hobby_ids:
        db.add(UserHobby(user_id=current_user.user_id, hobby_id=hobby_id))

    db.commit()
    db.refresh(current_user)
    return current_user.hobbies


# ── GET /users/{user_id} ──────────────────────────────────────────────────────
@router.get("/users/{user_id}", response_model=UserPublicOut)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Xem hồ sơ công khai của người dùng khác."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Người dùng không tồn tại")
    return user
