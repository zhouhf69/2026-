from pydantic import BaseModel


class SOPTemplateCreate(BaseModel):
    name: str
    sop_type: str
    disease_scope: str | None = None
    preparation_scope: str | None = None
    department_scope: str | None = None


class SOPVersionCreate(BaseModel):
    sop_template_id: str
    version_no: str
    operation_steps: str | None = None
    qc_points: str | None = None
    risk_points: str | None = None
    ai_suggestion: str | None = None
