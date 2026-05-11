from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import EvidencePackage, TransformationProject, User
from app.services.audit_service import write_audit_log

router = APIRouter()


class TransformationCreate(BaseModel):
    transformation_name: str
    evidence_level: str | None = None
    market_potential: str | None = None
    phase: str = "临床经验积累"
    milestones: str | None = None


@router.get("/projects")
def list_transformation_projects(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    rows = db.query(TransformationProject).filter(TransformationProject.deleted_at.is_(None)).order_by(TransformationProject.created_at.desc()).all()
    return [
        {
            "id": str(item.id),
            "transformation_name": item.transformation_name,
            "evidence_level": item.evidence_level,
            "market_potential": item.market_potential,
            "phase": item.phase,
            "milestones": item.milestones,
        }
        for item in rows
    ]


@router.post("/projects")
def create_transformation_project(
    payload: TransformationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "PI", "EnterprisePartner")),
) -> dict:
    item = TransformationProject(**payload.model_dump(), created_by=current_user.username, updated_by=current_user.username)
    db.add(item)
    db.commit()
    db.refresh(item)
    write_audit_log(
        db,
        log_type="数据修改日志",
        action="新增转化项目",
        target_type="transformation_projects",
        target_id=str(item.id),
        actor=current_user.username,
        detail=f"新增转化项目 {item.transformation_name}",
    )
    return {
        "id": str(item.id),
        "transformation_name": item.transformation_name,
        "evidence_level": item.evidence_level,
        "market_potential": item.market_potential,
        "phase": item.phase,
    }


@router.get("/evidence-packages")
def list_evidence_packages(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    rows = db.query(EvidencePackage).filter(EvidencePackage.deleted_at.is_(None)).order_by(EvidencePackage.created_at.desc()).all()
    return [
        {
            "id": str(item.id),
            "package_name": item.package_name,
            "package_type": item.package_type,
            "status": item.status,
            "summary": item.summary,
        }
        for item in rows
    ]
