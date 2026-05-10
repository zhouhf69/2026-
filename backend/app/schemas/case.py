from pydantic import BaseModel

from app.schemas.common import AuditFields


class CaseCreate(BaseModel):
    case_code: str
    deidentified_id: str
    age: int | None = None
    gender: str | None = None
    bmi: float | None = None
    primary_diagnosis: str | None = None
    project_id: str | None = None
    preparation_id: str | None = None
    usage_frequency: str | None = None
    enrollment_status: str = "已入组"


class CaseRead(AuditFields):
    case_code: str
    deidentified_id: str
    age: int | None = None
    gender: str | None = None
    primary_diagnosis: str | None = None
    enrollment_status: str
    followup_status: str
    adverse_event_status: str
