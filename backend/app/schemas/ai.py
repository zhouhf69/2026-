from typing import Any

from pydantic import BaseModel, Field


class AIGenerateRequest(BaseModel):
    provider: str = Field(description="openai|gemini|deepseek|kimi|qwen|local")
    task_type: str = Field(description="sop|protocol|crf|paper|report|evidence_package")
    input: dict[str, Any]


class AIGenerateResponse(BaseModel):
    output: str
    disclaimer: str
    review_status: str
