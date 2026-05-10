from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import CaseRecord, Patient, User
from app.schemas.case import CaseCreate, CaseRead
from app.services.audit_service import write_audit_log

router = APIRouter()


def _to_case_read(case: CaseRecord, patient: Patient) -> CaseRead:
    return CaseRead(
        id=case.id,
        created_at=case.created_at,
        updated_at=case.updated_at,
        case_code=case.case_code,
        deidentified_id=patient.deidentified_id,
        age=patient.age,
        gender=patient.gender,
        primary_diagnosis=patient.primary_diagnosis,
        enrollment_status=case.enrollment_status,
        followup_status=case.followup_status,
        adverse_event_status=case.adverse_event_status,
    )


@router.get("/", response_model=list[CaseRead])
def list_cases(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[CaseRead]:
    rows = (
        db.query(CaseRecord, Patient)
        .join(Patient, CaseRecord.patient_id == Patient.id)
        .filter(CaseRecord.deleted_at.is_(None), Patient.deleted_at.is_(None))
        .order_by(CaseRecord.created_at.desc())
        .all()
    )
    return [_to_case_read(case, patient) for case, patient in rows]


@router.post("/", response_model=CaseRead)
def create_case(
    payload: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "HospitalAdmin", "Doctor", "Nurse", "CRC", "PI")),
) -> CaseRead:
    patient = db.query(Patient).filter(Patient.deidentified_id == payload.deidentified_id, Patient.deleted_at.is_(None)).first()
    if not patient:
        patient = Patient(
            deidentified_id=payload.deidentified_id,
            age=payload.age,
            gender=payload.gender,
            bmi=payload.bmi,
            primary_diagnosis=payload.primary_diagnosis,
            created_by=current_user.username,
            updated_by=current_user.username,
        )
        db.add(patient)
        db.flush()

    case = CaseRecord(
        case_code=payload.case_code,
        patient_id=patient.id,
        project_id=payload.project_id,
        preparation_id=payload.preparation_id,
        usage_frequency=payload.usage_frequency,
        enrollment_status=payload.enrollment_status,
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    write_audit_log(
        db,
        log_type="数据修改日志",
        action="新增病例",
        target_type="cases",
        target_id=str(case.id),
        actor=current_user.username,
        detail=f"新增病例 {case.case_code}",
    )
    return _to_case_read(case, patient)


@router.get("/{case_id}", response_model=CaseRead)
def get_case(case_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> CaseRead:
    row = (
        db.query(CaseRecord, Patient)
        .join(Patient, CaseRecord.patient_id == Patient.id)
        .filter(CaseRecord.id == case_id, CaseRecord.deleted_at.is_(None))
        .first()
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="病例不存在")
    return _to_case_read(row[0], row[1])
