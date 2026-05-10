"""init preprws schema

Revision ID: 20260510_0001
Revises:
Create Date: 2026-05-10 08:20:00
"""

from alembic import op
from sqlalchemy import MetaData

from app.models import Base

# revision identifiers, used by Alembic.
revision = "20260510_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    metadata = MetaData()
    metadata.reflect(bind=bind)
    Base.metadata.drop_all(bind=bind)
