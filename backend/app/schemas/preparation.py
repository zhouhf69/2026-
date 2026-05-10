from pydantic import BaseModel

from app.schemas.common import AuditFields


class PreparationBase(BaseModel):
    prep_id: str
    name: str
    english_name: str | None = None
    prep_type: str
    dosage_form: str
    indications: str | None = None
    contraindications: str | None = None
    usage_dosage: str | None = None
    evidence_level: str | None = None


class PreparationCreate(PreparationBase):
    pass


class PreparationUpdate(BaseModel):
    name: str | None = None
    english_name: str | None = None
    prep_type: str | None = None
    dosage_form: str | None = None
    indications: str | None = None
    contraindications: str | None = None
    usage_dosage: str | None = None
    evidence_level: str | None = None


class PreparationRead(PreparationBase, AuditFields):
    related_case_count: int
