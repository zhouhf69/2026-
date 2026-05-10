from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class SOPTemplate(Base, TimestampAuditMixin):
    __tablename__ = "sop_templates"

    name: Mapped[str] = mapped_column(String(255))
    sop_type: Mapped[str] = mapped_column(String(80))
    disease_scope: Mapped[str | None] = mapped_column(String(255), nullable=True)
    preparation_scope: Mapped[str | None] = mapped_column(String(255), nullable=True)
    department_scope: Mapped[str | None] = mapped_column(String(255), nullable=True)
    owner: Mapped[str | None] = mapped_column(String(120), nullable=True)
    approval_status: Mapped[str] = mapped_column(String(50), default="草稿")


class SOPVersion(Base, TimestampAuditMixin):
    __tablename__ = "sop_versions"

    sop_template_id = mapped_column(ForeignKey("sop_templates.id"), index=True)
    version_no: Mapped[str] = mapped_column(String(20))
    effective_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    operation_steps: Mapped[str | None] = mapped_column(Text, nullable=True)
    qc_points: Mapped[str | None] = mapped_column(Text, nullable=True)
    risk_points: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_suggestion: Mapped[str | None] = mapped_column(Text, nullable=True)
    revision_log: Mapped[str | None] = mapped_column(Text, nullable=True)
