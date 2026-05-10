from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class Attachment(Base, TimestampAuditMixin):
    __tablename__ = "attachments"

    biz_type: Mapped[str] = mapped_column(String(80))
    biz_id: Mapped[str] = mapped_column(String(80))
    file_name: Mapped[str] = mapped_column(String(255))
    file_url: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
