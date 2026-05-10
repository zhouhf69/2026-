from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import AuditLog, User

router = APIRouter()


@router.get("/logs")
def list_logs(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "PI", "CRC", "Viewer")),
) -> list[dict]:
    logs = db.query(AuditLog).filter(AuditLog.deleted_at.is_(None)).order_by(AuditLog.created_at.desc()).limit(500).all()
    return [
        {
            "id": str(log.id),
            "log_type": log.log_type,
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "actor": log.actor,
            "detail": log.detail,
            "created_at": log.created_at.isoformat(),
        }
        for log in logs
    ]


@router.get("/consent")
def consent_stub(_: User = Depends(get_current_user)) -> dict:
    return {"status": "接口预留", "message": "知情同意记录将在后续版本接入HIS/EMR联动。"}


@router.get("/ethics")
def ethics_stub(_: User = Depends(get_current_user)) -> dict:
    return {"status": "接口预留", "message": "伦理审批记录接口预留。"}
