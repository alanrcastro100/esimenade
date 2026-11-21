from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent
STORAGE_DIR = BASE_DIR / "storage"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


class Settings(BaseSettings):
    app_name: str = "eSimENADE API"
    database_url: str = f"sqlite:///{(STORAGE_DIR / 'esimenade.db').as_posix()}"
    jwt_secret_key: str = "esimenade-dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 8

    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    seed_admin_name: str = "Professor Administrador"
    seed_admin_email: str = "admin@esimenade.com"
    seed_admin_password: str = "admin123"

    seed_student_name: str = "Aluno ENADE"
    seed_student_email: str = "aluno@esimenade.com"
    seed_student_password: str = "aluno123"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
