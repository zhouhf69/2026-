from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.models import Base
from app.core.database import engine

settings = get_settings()

app = FastAPI(
    title="PrepRWS AI Backend",
    version="0.1.0",
    description="AI辅助院内制剂真实世界研究与循证转化平台后端API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.on_event("startup")
def startup_event() -> None:
    # 开发模式下允许自动建表，生产环境建议仅通过Alembic迁移。
    if settings.app_env == "dev":
        Base.metadata.create_all(bind=engine)
