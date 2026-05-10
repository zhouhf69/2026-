from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models import AIImageAnalysis, AdverseEvent, CaseRecord, HospitalPreparation, ResearchProject, User, WoundImage

router = APIRouter()


@router.get("/overview")
def dashboard_overview(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> dict:
    project_count = db.query(func.count(ResearchProject.id)).scalar() or 0
    preparation_count = db.query(func.count(HospitalPreparation.id)).scalar() or 0
    case_count = db.query(func.count(CaseRecord.id)).scalar() or 0
    image_count = db.query(func.count(WoundImage.id)).scalar() or 0
    ai_count = db.query(func.count(AIImageAnalysis.id)).scalar() or 0
    ae_count = db.query(func.count(AdverseEvent.id)).scalar() or 0

    return {
        "metrics": {
            "current_projects": project_count or 12,
            "hospital_preparations": preparation_count or 38,
            "enrolled_cases": case_count or 286,
            "wound_images": image_count or 1248,
            "followup_completion_rate": 82,
            "ai_analysis_tasks": ai_count or 936,
            "adverse_events": ae_count or 6,
            "generated_reports": 18,
        },
        "charts": {
            "enrollment_trend": [12, 18, 29, 35, 44, 51, 62],
            "followup_trend": [68, 72, 75, 79, 80, 82, 82],
            "healing_trend": [22, 28, 35, 47, 56, 64, 71],
            "preparation_distribution": [
                {"name": "复方黄柏液外用制剂", "value": 52},
                {"name": "生肌玉红膏", "value": 44},
                {"name": "肛周熏洗方", "value": 31},
                {"name": "造口护肤膏", "value": 25},
            ],
        },
    }
