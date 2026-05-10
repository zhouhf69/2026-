from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import FollowupPlan, FollowupRecord, User
from app.schemas.followup import FollowupPlanCreate, FollowupRecordCreate

router = APIRouter()


@router.get("/plans")
def list_plans(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    plans = db.query(FollowupPlan).filter(FollowupPlan.deleted_at.is_(None)).order_by(FollowupPlan.created_at.desc()).all()
    return [{"id": str(plan.id), "case_id": str(plan.case_id), "plan_name": plan.plan_name, "nodes": plan.nodes, "status": plan.status} for plan in plans]


@router.post("/plans")
def create_plan(
    payload: FollowupPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "Doctor", "Nurse", "CRC", "PI")),
) -> dict:
    plan = FollowupPlan(
        **payload.model_dump(),
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return {"id": str(plan.id), "case_id": str(plan.case_id), "plan_name": plan.plan_name, "nodes": plan.nodes, "status": plan.status}


@router.get("/records")
def list_records(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    records = db.query(FollowupRecord).filter(FollowupRecord.deleted_at.is_(None)).order_by(FollowupRecord.created_at.desc()).all()
    return [
        {
            "id": str(record.id),
            "plan_id": str(record.plan_id),
            "node_day": record.node_day,
            "pain_score": record.pain_score,
            "itch_score": record.itch_score,
            "exudate_status": record.exudate_status,
            "compliance": record.compliance,
            "missing_flag": record.missing_flag,
        }
        for record in records
    ]


@router.post("/records")
def create_record(
    payload: FollowupRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "Doctor", "Nurse", "CRC", "PI")),
) -> dict:
    record = FollowupRecord(
        **payload.model_dump(),
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": str(record.id), "plan_id": str(record.plan_id), "node_day": record.node_day, "missing_flag": record.missing_flag}


@router.get("/missing-reminders")
def missing_reminders(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> dict:
    missing = db.query(FollowupRecord).filter(FollowupRecord.missing_flag.is_(True), FollowupRecord.deleted_at.is_(None)).count()
    return {"missing_count": missing, "message": "请尽快补全缺失随访记录"}
