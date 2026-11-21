from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_admin, require_student
from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse


router = APIRouter(tags=["Autenticação"])


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    email = payload.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos. Não foi possível realizar o login.",
        )

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.get("/admin/overview")
def admin_overview(current_user: User = Depends(require_admin)) -> dict:
    return {
        "message": f"Bem-vindo(a), {current_user.name}.",
        "role": current_user.role.value,
        "permissions": ["upload_exams", "review_questions", "manage_answer_keys"],
    }


@router.get("/student/overview")
def student_overview(current_user: User = Depends(require_student)) -> dict:
    return {
        "message": f"Bem-vindo(a), {current_user.name}.",
        "role": current_user.role.value,
        "permissions": ["list_exams", "take_simulated_exams"],
    }
