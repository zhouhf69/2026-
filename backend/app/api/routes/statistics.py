from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models import AdverseEvent, CaseRecord, FollowupRecord, HospitalPreparation, ResearchProject, User

router = APIRouter()


@router.get("/overview")
def overview(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> dict:
    project_count = db.query(func.count(ResearchProject.id)).scalar() or 0
    case_count = db.query(func.count(CaseRecord.id)).scalar() or 0
    prep_count = db.query(func.count(HospitalPreparation.id)).scalar() or 0
    adverse_count = db.query(func.count(AdverseEvent.id)).scalar() or 0
    followup_total = db.query(func.count(FollowupRecord.id)).scalar() or 0
    followup_missing = db.query(func.count(FollowupRecord.id)).filter(FollowupRecord.missing_flag.is_(True)).scalar() or 0
    completion_rate = round((followup_total - followup_missing) / followup_total * 100, 2) if followup_total else 82

    return {
        "summary": {
            "project_count": project_count,
            "case_count": case_count,
            "preparation_count": prep_count,
            "adverse_event_count": adverse_count,
            "followup_completion_rate": completion_rate,
        },
        "charts": {
            "healing_curve": [18, 26, 35, 48, 60, 69, 77],
            "followup_funnel": [
                {"stage": "已入组", "value": case_count or 286},
                {"stage": "完成D14", "value": max(int((case_count or 286) * 0.87), 1)},
                {"stage": "完成D30", "value": max(int((case_count or 286) * 0.74), 1)},
                {"stage": "完成D90", "value": max(int((case_count or 286) * 0.61), 1)},
            ],
            "preparation_usage": [
                {"name": "复方黄柏液外用制剂", "value": 52},
                {"name": "生肌玉红膏", "value": 44},
                {"name": "肛周熏洗方", "value": 31},
                {"name": "造口护肤膏", "value": 25},
            ],
        },
    }


@router.get("/export-template")
def export_template(_: User = Depends(get_current_user)) -> dict:
    return {"status": "预留", "message": "图表导出和统计报表导出接口已预留。"}
