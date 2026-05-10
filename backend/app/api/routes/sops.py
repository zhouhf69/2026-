from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import SOPTemplate, SOPVersion, User
from app.schemas.sop import SOPTemplateCreate, SOPVersionCreate

router = APIRouter()


@router.get("/templates")
def list_templates(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    templates = db.query(SOPTemplate).filter(SOPTemplate.deleted_at.is_(None)).order_by(SOPTemplate.created_at.desc()).all()
    return [
        {
            "id": str(item.id),
            "name": item.name,
            "sop_type": item.sop_type,
            "approval_status": item.approval_status,
        }
        for item in templates
    ]


@router.post("/templates")
def create_template(
    payload: SOPTemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "PI", "CRC")),
) -> dict:
    template = SOPTemplate(
        **payload.model_dump(),
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return {"id": str(template.id), "name": template.name, "sop_type": template.sop_type, "approval_status": template.approval_status}


@router.get("/versions")
def list_versions(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    versions = db.query(SOPVersion).filter(SOPVersion.deleted_at.is_(None)).order_by(SOPVersion.created_at.desc()).all()
    return [
        {
            "id": str(item.id),
            "sop_template_id": str(item.sop_template_id),
            "version_no": item.version_no,
            "effective_date": item.effective_date,
        }
        for item in versions
    ]


@router.post("/versions")
def create_version(
    payload: SOPVersionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "PI", "CRC")),
) -> dict:
    version = SOPVersion(
        **payload.model_dump(),
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return {"id": str(version.id), "sop_template_id": str(version.sop_template_id), "version_no": version.version_no}
