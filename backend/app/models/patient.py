from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class Patient(Base, TimestampAuditMixin):
    __tablename__ = "patients"

    deidentified_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    bmi: Mapped[float | None] = mapped_column(nullable=True)
    primary_diagnosis: Mapped[str | None] = mapped_column(String(255), nullable=True)
    comorbidities: Mapped[str | None] = mapped_column(Text, nullable=True)
    history: Mapped[str | None] = mapped_column(Text, nullable=True)


class CaseRecord(Base, TimestampAuditMixin):
    __tablename__ = "cases"

    case_code: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    patient_id = mapped_column(ForeignKey("patients.id"), index=True)
    project_id = mapped_column(ForeignKey("research_projects.id"), nullable=True)
    preparation_id = mapped_column(ForeignKey("hospital_preparations.id"), nullable=True)
    current_medication: Mapped[str | None] = mapped_column(Text, nullable=True)
    usage_start_time: Mapped[str | None] = mapped_column(String(30), nullable=True)
    usage_frequency: Mapped[str | None] = mapped_column(String(50), nullable=True)
    enrollment_status: Mapped[str] = mapped_column(String(50), default="已入组")
    followup_status: Mapped[str] = mapped_column(String(50), default="待随访")
    efficacy_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    adverse_event_status: Mapped[str] = mapped_column(String(50), default="无")


class AdverseEvent(Base, TimestampAuditMixin):
    __tablename__ = "adverse_events"

    case_id = mapped_column(ForeignKey("cases.id"), index=True)
    event_term: Mapped[str] = mapped_column(String(255))
    severity: Mapped[str] = mapped_column(String(50))
    relation_to_drug: Mapped[str | None] = mapped_column(String(50), nullable=True)
    action_taken: Mapped[str | None] = mapped_column(Text, nullable=True)
    outcome: Mapped[str | None] = mapped_column(String(100), nullable=True)
