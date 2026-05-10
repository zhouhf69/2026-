from pydantic import BaseModel


class FollowupPlanCreate(BaseModel):
    case_id: str
    plan_name: str
    nodes: str = "D1,D3,D7,D14,D30,D60,D90"


class FollowupRecordCreate(BaseModel):
    plan_id: str
    node_day: str
    pain_score: int | None = None
    itch_score: int | None = None
    exudate_status: str | None = None
    compliance: str | None = None
    missing_flag: bool = False
