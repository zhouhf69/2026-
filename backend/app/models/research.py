from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.common import TimestampAuditMixin


class ResearchProject(Base, TimestampAuditMixin):
    __tablename__ = "research_projects"

    project_name: Mapped[str] = mapped_column(String(255), index=True)
    project_code: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    research_type: Mapped[str] = mapped_column(String(80))
    objective: Mapped[str | None] = mapped_column(Text, nullable=True)
    hypothesis: Mapped[str | None] = mapped_column(Text, nullable=True)
    pi_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    departments: Mapped[str | None] = mapped_column(String(255), nullable=True)
    centers: Mapped[str | None] = mapped_column(String(255), nullable=True)
    start_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    end_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    sample_target: Mapped[int] = mapped_column(Integer, default=0)
    current_enrollment: Mapped[int] = mapped_column(Integer, default=0)
    inclusion_criteria: Mapped[str | None] = mapped_column(Text, nullable=True)
    exclusion_criteria: Mapped[str | None] = mapped_column(Text, nullable=True)
    primary_endpoints: Mapped[str | None] = mapped_column(Text, nullable=True)
    secondary_endpoints: Mapped[str | None] = mapped_column(Text, nullable=True)
    safety_indicators: Mapped[str | None] = mapped_column(Text, nullable=True)
    followup_nodes: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ethics_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    consent_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    project_status: Mapped[str] = mapped_column(String(50), default="草稿")

    members: Mapped[list["ProjectMember"]] = relationship(back_populates="project")


class ProjectMember(Base, TimestampAuditMixin):
    __tablename__ = "project_members"

    project_id = mapped_column(ForeignKey("research_projects.id"), index=True)
    user_id = mapped_column(ForeignKey("users.id"), index=True)
    role_in_project: Mapped[str] = mapped_column(String(80))

    project: Mapped[ResearchProject] = relationship(back_populates="members")


class EvidencePackage(Base, TimestampAuditMixin):
    __tablename__ = "evidence_packages"

    project_id = mapped_column(ForeignKey("research_projects.id"), nullable=True)
    package_name: Mapped[str] = mapped_column(String(255))
    package_type: Mapped[str] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(50), default="草稿")
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)


class TransformationProject(Base, TimestampAuditMixin):
    __tablename__ = "transformation_projects"

    project_id = mapped_column(ForeignKey("research_projects.id"), nullable=True)
    transformation_name: Mapped[str] = mapped_column(String(255))
    evidence_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    market_potential: Mapped[str | None] = mapped_column(String(50), nullable=True)
    phase: Mapped[str] = mapped_column(String(50), default="临床经验积累")
    milestones: Mapped[str | None] = mapped_column(Text, nullable=True)
