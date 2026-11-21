from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole


def seed_default_users(db: Session) -> None:
    defaults = [
        (
            settings.seed_admin_name,
            settings.seed_admin_email.lower(),
            settings.seed_admin_password,
            UserRole.ADMIN,
        ),
        (
            settings.seed_student_name,
            settings.seed_student_email.lower(),
            settings.seed_student_password,
            UserRole.STUDENT,
        ),
    ]

    changed = False
    for name, email, password, role in defaults:
        existing = db.scalar(select(User).where(User.email == email))
        if existing is None:
            db.add(
                User(
                    name=name,
                    email=email,
                    password_hash=hash_password(password),
                    role=role,
                )
            )
            changed = True

    if changed:
        db.commit()
