from fastapi import APIRouter

from app.api.routes import ai, audit, auth, cases, dashboard, followups, preparations, projects, sops, wounds

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(preparations.router, prefix="/preparations", tags=["院内制剂"])
api_router.include_router(projects.router, prefix="/projects", tags=["研究项目"])
api_router.include_router(cases.router, prefix="/cases", tags=["病例管理"])
api_router.include_router(wounds.router, prefix="/wounds", tags=["创面图像"])
api_router.include_router(followups.router, prefix="/followups", tags=["随访管理"])
api_router.include_router(sops.router, prefix="/sops", tags=["SOP中心"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI科研助手"])
api_router.include_router(audit.router, prefix="/audit", tags=["审计日志"])
