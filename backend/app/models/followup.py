from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class FollowupPlan(Base, TimestampAuditMixin):
    __tablename__ = "followup_plans"

    case_id = mapped_column(ForeignKey("cases.id"), index=True)
    plan_name: Mapped[str] = mapped_column(String(120))
    nodes: Mapped[str] = mapped_column(String(120), default="D1,D3,D7,D14,D30,D60,D90")
    status: Mapped[str] = mapped_column(String(50), default="进行中")


class FollowupRecord(Base, TimestampAuditMixin):
    __tablename__ = "followup_records"

    plan_id = mapped_column(ForeignKey("followup_plans.id"), index=True)
    node_day: Mapped[str] = mapped_column(String(20))
    pain_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    itch_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    exudate_status: Mapped[str | None] = mapped_column(String(120), nullable=True)
    dressing_frequency: Mapped[str | None] = mapped_column(String(80), nullable=True)
    compliance: Mapped[str | None] = mapped_column(String(80), nullable=True)
    adverse_reaction: Mapped[str | None] = mapped_column(Text, nullable=True)
    satisfaction: Mapped[int | None] = mapped_column(Integer, nullable=True)
    recurrence: Mapped[str | None] = mapped_column(String(80), nullable=True)
    missing_flag: Mapped[bool] = mapped_column(default=False)
