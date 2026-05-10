from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class Wound(Base, TimestampAuditMixin):
    __tablename__ = "wounds"

    case_id = mapped_column(ForeignKey("cases.id"), index=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    wound_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    baseline_area: Mapped[float | None] = mapped_column(nullable=True)
    pain_score: Mapped[int | None] = mapped_column(Integer, nullable=True)


class WoundImage(Base, TimestampAuditMixin):
    __tablename__ = "wound_images"

    wound_id = mapped_column(ForeignKey("wounds.id"), index=True)
    file_url: Mapped[str] = mapped_column(String(255))
    shot_time: Mapped[str | None] = mapped_column(String(30), nullable=True)
    shot_site: Mapped[str | None] = mapped_column(String(120), nullable=True)
    shot_angle: Mapped[str | None] = mapped_column(String(80), nullable=True)
    sop_compliant: Mapped[bool] = mapped_column(default=True)
    quality_score: Mapped[float | None] = mapped_column(nullable=True)


class AIImageAnalysis(Base, TimestampAuditMixin):
    __tablename__ = "ai_image_analysis"

    wound_image_id = mapped_column(ForeignKey("wound_images.id"), index=True)
    wound_area: Mapped[float | None] = mapped_column(nullable=True)
    redness_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    exudate_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    granulation_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    necrosis_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    infection_risk_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    healing_percentage: Mapped[float | None] = mapped_column(nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(nullable=True)
    ai_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    doctor_review_status: Mapped[str] = mapped_column(String(50), default="待审核")
