from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class HospitalPreparation(Base, TimestampAuditMixin):
    __tablename__ = "hospital_preparations"

    prep_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    english_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    prep_type: Mapped[str] = mapped_column(String(50))
    dosage_form: Mapped[str] = mapped_column(String(50))
    formula_source: Mapped[str | None] = mapped_column(Text, nullable=True)
    classic_reference: Mapped[str | None] = mapped_column(Text, nullable=True)
    ingredients: Mapped[str | None] = mapped_column(Text, nullable=True)
    indications: Mapped[str | None] = mapped_column(Text, nullable=True)
    contraindications: Mapped[str | None] = mapped_column(Text, nullable=True)
    usage_dosage: Mapped[str | None] = mapped_column(Text, nullable=True)
    adverse_reactions: Mapped[str | None] = mapped_column(Text, nullable=True)
    approval_info: Mapped[str | None] = mapped_column(String(255), nullable=True)
    qc_points: Mapped[str | None] = mapped_column(Text, nullable=True)
    evidence_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    related_case_count: Mapped[int] = mapped_column(Integer, default=0)

    batches: Mapped[list["PreparationBatch"]] = relationship(back_populates="preparation")


class PreparationBatch(Base, TimestampAuditMixin):
    __tablename__ = "preparation_batches"

    preparation_id = mapped_column(ForeignKey("hospital_preparations.id"), index=True)
    batch_no: Mapped[str] = mapped_column(String(80), index=True)
    manufacture_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    expiry_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    qc_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    preparation: Mapped[HospitalPreparation] = relationship(back_populates="batches")
