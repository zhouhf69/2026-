from pydantic import BaseModel

from app.schemas.common import AuditFields


class ProjectBase(BaseModel):
    project_name: str
    project_code: str
    research_type: str
    objective: str | None = None
    pi_name: str | None = None
    inclusion_criteria: str | None = None
    exclusion_criteria: str | None = None
    followup_nodes: str | None = None
    sample_target: int = 0
    project_status: str = "草稿"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_name: str | None = None
    research_type: str | None = None
    objective: str | None = None
    pi_name: str | None = None
    inclusion_criteria: str | None = None
    exclusion_criteria: str | None = None
    followup_nodes: str | None = None
    sample_target: int | None = None
    current_enrollment: int | None = None
    project_status: str | None = None


class ProjectRead(ProjectBase, AuditFields):
    current_enrollment: int
