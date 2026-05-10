from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class Role(Base, TimestampAuditMixin):
    __tablename__ = "roles"

    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)


class Department(Base, TimestampAuditMixin):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(120), unique=True)
    hospital_name: Mapped[str | None] = mapped_column(String(120), nullable=True)


class User(Base, TimestampAuditMixin):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(128), nullable=True)
    full_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    role_id = mapped_column(ForeignKey("roles.id"))
    department_id = mapped_column(ForeignKey("departments.id"), nullable=True)

    role: Mapped[Role] = relationship()
    department: Mapped[Department | None] = relationship()
