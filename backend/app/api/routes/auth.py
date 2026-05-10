from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.models import User
from app.schemas.auth import LoginRequest, TokenResponse, UserProfile
from app.services.audit_service import write_audit_log

settings = get_settings()
router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.username == payload.username, User.deleted_at.is_(None)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")

    token = create_access_token(subject=user.username, expires_delta=timedelta(minutes=settings.access_token_expire_minutes))
    write_audit_log(
        db,
        log_type="用户操作日志",
        action="登录",
        target_type="users",
        target_id=str(user.id),
        actor=user.username,
        detail="用户登录系统",
    )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserProfile)
def me(current_user: User = Depends(get_current_user)) -> UserProfile:
    return UserProfile(
        username=current_user.username,
        full_name=current_user.full_name,
        role=current_user.role.code if current_user.role else "Viewer",
        department=current_user.department.name if current_user.department else None,
    )
