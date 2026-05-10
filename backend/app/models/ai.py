from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class AIPrompt(Base, TimestampAuditMixin):
    __tablename__ = "ai_prompts"

    task_type: Mapped[str] = mapped_column(String(80))
    provider: Mapped[str] = mapped_column(String(30))
    payload: Mapped[str] = mapped_column(Text)
    requester_id = mapped_column(ForeignKey("users.id"), nullable=True)


class AIOutput(Base, TimestampAuditMixin):
    __tablename__ = "ai_outputs"

    prompt_id = mapped_column(ForeignKey("ai_prompts.id"), index=True)
    output_text: Mapped[str] = mapped_column(Text)
    review_status: Mapped[str] = mapped_column(String(50), default="待医生审核")
    reviewer: Mapped[str | None] = mapped_column(String(120), nullable=True)
    reviewed_at: Mapped[str | None] = mapped_column(String(30), nullable=True)
    modify_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
