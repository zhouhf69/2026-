from random import randint, uniform
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_roles
from app.models import AIImageAnalysis, CaseRecord, User, Wound, WoundImage
from app.schemas.wound import ImageManualScoreUpdate, WoundCreate
from app.services.audit_service import write_audit_log
from app.services.upload_service import save_upload_file

router = APIRouter()


@router.post("/")
def create_wound(
    payload: WoundCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "Doctor", "Nurse", "CRC", "PI")),
) -> dict:
    case = db.query(CaseRecord).filter(CaseRecord.id == payload.case_id, CaseRecord.deleted_at.is_(None)).first()
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="病例不存在")
    wound = Wound(
        case_id=payload.case_id,
        location=payload.location,
        wound_type=payload.wound_type,
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(wound)
    db.commit()
    db.refresh(wound)
    return {"id": str(wound.id)}


@router.post("/images/upload")
def upload_wound_image(
    wound_id: str = Form(...),
    shot_time: str | None = Form(default=None),
    shot_site: str | None = Form(default=None),
    shot_angle: str | None = Form(default=None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "Doctor", "Nurse", "CRC", "PI")),
) -> dict:
    wound = db.query(Wound).filter(Wound.id == wound_id, Wound.deleted_at.is_(None)).first()
    if not wound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="创面记录不存在")

    file_url = save_upload_file(file)
    image = WoundImage(
        wound_id=wound_id,
        file_url=file_url,
        shot_time=shot_time,
        shot_site=shot_site,
        shot_angle=shot_angle,
        quality_score=round(uniform(0.8, 0.99), 2),
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(image)
    db.flush()

    analysis = AIImageAnalysis(
        wound_image_id=image.id,
        wound_area=round(uniform(2.5, 13.5), 2),
        redness_score=randint(1, 4),
        exudate_score=randint(1, 4),
        granulation_score=randint(1, 4),
        necrosis_score=randint(0, 3),
        infection_risk_score=randint(1, 4),
        healing_percentage=round(uniform(35, 88), 2),
        confidence_score=round(uniform(0.75, 0.95), 2),
        ai_comment="AI辅助建议，仅供临床研究和医生审核参考，不能替代医生判断。",
        created_by=current_user.username,
        updated_by=current_user.username,
    )
    db.add(analysis)
    db.commit()
    db.refresh(image)
    db.refresh(analysis)

    write_audit_log(
        db,
        log_type="AI建议日志",
        action="创面AI分析",
        target_type="ai_image_analysis",
        target_id=str(analysis.id),
        actor=current_user.username,
        detail=f"上传图像并生成分析: {image.file_url}",
    )
    return {"image_id": str(image.id), "analysis_id": str(analysis.id), "file_url": image.file_url}


@router.get("/images")
def list_wound_images(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[dict]:
    rows = (
        db.query(WoundImage, AIImageAnalysis)
        .join(AIImageAnalysis, AIImageAnalysis.wound_image_id == WoundImage.id)
        .filter(WoundImage.deleted_at.is_(None))
        .order_by(WoundImage.created_at.desc())
        .all()
    )
    return [
        {
            "image_id": str(image.id),
            "wound_id": str(image.wound_id),
            "file_url": image.file_url,
            "quality_score": image.quality_score,
            "analysis_id": str(analysis.id),
            "doctor_review_status": analysis.doctor_review_status,
        }
        for image, analysis in rows
    ]


@router.get("/analysis/{analysis_id}")
def get_analysis(analysis_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> dict:
    analysis = db.query(AIImageAnalysis).filter(AIImageAnalysis.id == analysis_id, AIImageAnalysis.deleted_at.is_(None)).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI分析不存在")
    return {
        "id": str(analysis.id),
        "wound_area": analysis.wound_area,
        "redness_score": analysis.redness_score,
        "exudate_score": analysis.exudate_score,
        "granulation_score": analysis.granulation_score,
        "necrosis_score": analysis.necrosis_score,
        "infection_risk_score": analysis.infection_risk_score,
        "healing_percentage": analysis.healing_percentage,
        "confidence_score": analysis.confidence_score,
        "ai_comment": analysis.ai_comment,
        "doctor_review_status": analysis.doctor_review_status,
    }


@router.put("/analysis/{analysis_id}/review")
def review_analysis(
    analysis_id: UUID,
    payload: ImageManualScoreUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SuperAdmin", "Doctor", "PI")),
) -> dict:
    analysis = db.query(AIImageAnalysis).filter(AIImageAnalysis.id == analysis_id, AIImageAnalysis.deleted_at.is_(None)).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI分析不存在")
    analysis.doctor_review_status = payload.doctor_review_status
    if payload.ai_comment:
        analysis.ai_comment = payload.ai_comment
    analysis.updated_by = current_user.username
    db.commit()
    return {"message": "审核已更新"}
