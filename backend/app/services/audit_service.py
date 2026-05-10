from sqlalchemy.orm import Session

from app.models import AuditLog


def write_audit_log(
    db: Session,
    *,
    log_type: str,
    action: str,
    target_type: str,
    target_id: str | None,
    actor: str | None,
    detail: str | None,
) -> AuditLog:
    log = AuditLog(
        log_type=log_type,
        action=action,
        target_type=target_type,
        target_id=target_id,
        actor=actor,
        detail=detail,
        created_by=actor,
        updated_by=actor,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
