from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import HospitalPreparation, User
from app.schemas.preparation import PreparationCreate, PreparationRead, PreparationUpdate
from app.services.audit_service import write_audit_log

router = APIRouter()


@router.get("/", response_model=list[PreparationRead])
def list_preparations(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[HospitalPreparation]:
    return db.query(HospitalPreparation).filter(HospitalPreparation.deleted_at.is_(None)).order_by(HospitalPreparation.created_at.desc()).all()


@router.post("/", response_model=PreparationRead)
def create_preparation(
    payload: PreparationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "Pharmacist", "PI")),
) -> HospitalPreparation:
    preparation = HospitalPreparation(**payload.model_dump(), created_by=current_user.username, updated_by=current_user.username)
    db.add(preparation)
    db.commit()
    db.refresh(preparation)
    write_audit_log(
        db,
        log_type="数据修改日志",
        action="新增制剂",
        target_type="hospital_preparations",
        target_id=str(preparation.id),
        actor=current_user.username,
        detail=f"新增制剂 {preparation.name}",
    )
    return preparation


@router.get("/{preparation_id}", response_model=PreparationRead)
def get_preparation(preparation_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> HospitalPreparation:
    prep = db.query(HospitalPreparation).filter(HospitalPreparation.id == preparation_id, HospitalPreparation.deleted_at.is_(None)).first()
    if not prep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="制剂不存在")
    return prep


@router.put("/{preparation_id}", response_model=PreparationRead)
def update_preparation(
    preparation_id: UUID,
    payload: PreparationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "Pharmacist", "PI")),
) -> HospitalPreparation:
    prep = db.query(HospitalPreparation).filter(HospitalPreparation.id == preparation_id, HospitalPreparation.deleted_at.is_(None)).first()
    if not prep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="制剂不存在")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(prep, field, value)
    prep.updated_by = current_user.username
    db.commit()
    db.refresh(prep)
    write_audit_log(
        db,
        log_type="数据修改日志",
        action="更新制剂",
        target_type="hospital_preparations",
        target_id=str(prep.id),
        actor=current_user.username,
        detail=f"更新制剂 {prep.name}",
    )
    return prep


@router.delete("/{preparation_id}")
def delete_preparation(
    preparation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin")),
) -> dict:
    prep = db.query(HospitalPreparation).filter(HospitalPreparation.id == preparation_id, HospitalPreparation.deleted_at.is_(None)).first()
    if not prep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="制剂不存在")
    prep.deleted_at = prep.updated_at
    prep.updated_by = current_user.username
    db.commit()
    return {"message": "已删除"}
