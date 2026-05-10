from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import ResearchProject, User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.audit_service import write_audit_log

router = APIRouter()


@router.get("/", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[ResearchProject]:
    return db.query(ResearchProject).filter(ResearchProject.deleted_at.is_(None)).order_by(ResearchProject.created_at.desc()).all()


@router.post("/", response_model=ProjectRead)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "DepartmentDirector", "PI", "CRC")),
) -> ResearchProject:
    project = ResearchProject(**payload.model_dump(), created_by=current_user.username, updated_by=current_user.username)
    db.add(project)
    db.commit()
    db.refresh(project)
    write_audit_log(
        db,
        log_type="数据修改日志",
        action="新增项目",
        target_type="research_projects",
        target_id=str(project.id),
        actor=current_user.username,
        detail=f"新增项目 {project.project_name}",
    )
    return project


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> ResearchProject:
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id, ResearchProject.deleted_at.is_(None)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    return project


@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "DepartmentDirector", "PI", "CRC")),
) -> ResearchProject:
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id, ResearchProject.deleted_at.is_(None)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="项目不存在")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(project, key, value)
    project.updated_by = current_user.username
    db.commit()
    db.refresh(project)
    return project
