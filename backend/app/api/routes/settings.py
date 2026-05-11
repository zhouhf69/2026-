from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import Role, User
from app.rbac.permissions import ROLE_MENU_SCOPE

router = APIRouter()


@router.get("/roles")
def list_roles(db: Session = Depends(get_db), _: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "PI", "Viewer"))) -> list[dict]:
    rows = db.query(Role).filter(Role.deleted_at.is_(None)).order_by(Role.code.asc()).all()
    return [
        {
            "id": str(role.id),
            "code": role.code,
            "name": role.name,
            "description": role.description,
            "menu_scope": ROLE_MENU_SCOPE.get(role.code, []),
            "page_scope": ROLE_MENU_SCOPE.get(role.code, []),
            "button_scope": ["create", "update", "review"] if role.code in {"SuperAdmin", "HospitalAdmin", "PI"} else ["view"],
            "export_permission": role.code in {"SuperAdmin", "HospitalAdmin", "PI", "CRC"},
            "review_permission": role.code in {"SuperAdmin", "HospitalAdmin", "PI", "Doctor"},
        }
        for role in rows
    ]


@router.get("/system-config")
def system_config(_: User = Depends(get_current_user)) -> dict:
    return {
        "departments": ["创面修复中心", "肛肠科", "皮肤科", "烧伤科", "药学部"],
        "score_scales": ["疼痛NRS", "红肿评分", "渗液评分", "肉芽评分", "坏死评分"],
        "ai_providers": ["openai", "gemini", "deepseek", "kimi", "qwen", "local"],
        "message_channels": ["站内消息", "短信接口预留", "微信接口预留"],
    }


@router.get("/my-permission")
def my_permission(current_user: User = Depends(get_current_user)) -> dict:
    role_code = current_user.role.code if current_user.role else "Viewer"
    return {
        "username": current_user.username,
        "role": role_code,
        "menu_scope": ROLE_MENU_SCOPE.get(role_code, []),
        "project_scope": "all" if role_code in {"SuperAdmin", "HospitalAdmin"} else "department",
        "data_scope": "deidentified",
    }
