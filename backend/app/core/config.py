from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "PrepRWS AI Backend"
    app_env: Literal["dev", "test", "prod"] = "dev"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    secret_key: str = Field(default="replace-this-in-production", min_length=16)
    access_token_expire_minutes: int = 60 * 12
    jwt_algorithm: str = "HS256"

    database_url: str = "postgresql+psycopg://preprws:preprws@db:5432/preprws"
    redis_url: str = "redis://redis:6379/0"

    file_storage: Literal["local", "minio", "s3"] = "local"
    upload_dir: str = "uploads"
    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "preprws"
    minio_secure: bool = False

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
