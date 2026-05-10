from pydantic import BaseModel


class WoundCreate(BaseModel):
    case_id: str
    location: str | None = None
    wound_type: str | None = None


class ImageManualScoreUpdate(BaseModel):
    doctor_review_status: str
    ai_comment: str | None = None
