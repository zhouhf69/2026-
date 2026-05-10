import json

from sqlalchemy.orm import Session

from app.models import AIOutput, AIPrompt

AI_DISCLAIMER = "AI辅助建议，仅供临床研究和医生审核参考，不能替代医生判断。"


def generate_ai_content(db: Session, *, provider: str, task_type: str, input_payload: dict, requester: str) -> AIOutput:
    prompt = AIPrompt(
        provider=provider,
        task_type=task_type,
        payload=json.dumps(input_payload, ensure_ascii=False),
        created_by=requester,
        updated_by=requester,
    )
    db.add(prompt)
    db.flush()

    generated = (
        f"[{task_type}] 模拟输出（provider={provider}）\n"
        f"输入摘要：{json.dumps(input_payload, ensure_ascii=False)[:300]}\n"
        "建议先由PI与伦理委员联合复核后使用。"
    )
    output = AIOutput(
        prompt_id=prompt.id,
        output_text=f"{generated}\n\n{AI_DISCLAIMER}",
        review_status="待医生审核",
        created_by=requester,
        updated_by=requester,
    )
    db.add(output)
    db.commit()
    db.refresh(output)
    return output
