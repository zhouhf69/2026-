from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import get_settings

settings = get_settings()


def save_upload_file(file: UploadFile) -> str:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    extension = Path(file.filename or "").suffix or ".jpg"
    output_name = f"{uuid4()}{extension}"
    output_path = upload_dir / output_name
    output_path.write_bytes(file.file.read())
    return str(output_path)
