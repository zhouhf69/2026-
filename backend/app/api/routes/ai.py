from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models import User
from app.schemas.ai import AIGenerateRequest, AIGenerateResponse
from app.services.ai_service import AI_DISCLAIMER, generate_ai_content
from app.services.audit_service import write_audit_log

router = APIRouter()


@router.post("/generate", response_model=AIGenerateResponse)
def generate(payload: AIGenerateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> AIGenerateResponse:
    output = generate_ai_content(
        db,
        provider=payload.provider,
        task_type=payload.task_type,
        input_payload=payload.input,
        requester=current_user.username,
    )
    write_audit_log(
        db,
        log_type="AI建议日志",
        action="文本AI生成",
        target_type="ai_outputs",
        target_id=str(output.id),
        actor=current_user.username,
        detail=f"provider={payload.provider}, task={payload.task_type}",
    )
    return AIGenerateResponse(output=output.output_text, disclaimer=AI_DISCLAIMER, review_status=output.review_status)
