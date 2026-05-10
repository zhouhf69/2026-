from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class CRFTemplate(Base, TimestampAuditMixin):
    __tablename__ = "crf_templates"

    project_id = mapped_column(ForeignKey("research_projects.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    crf_type: Mapped[str] = mapped_column(String(80))
    schema_json: Mapped[str] = mapped_column(Text)


class CRFRecord(Base, TimestampAuditMixin):
    __tablename__ = "crf_records"

    template_id = mapped_column(ForeignKey("crf_templates.id"), index=True)
    case_id = mapped_column(ForeignKey("cases.id"), index=True)
    form_data: Mapped[str] = mapped_column(Text)
