from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.database import Base, get_db
from app.main import app
from app.services.seed import seed_default_users


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    seed_default_users(db)
    db.close()

    def override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_admin_login_success_and_access(client: TestClient):
    res = client.post(
        "/api/auth/login",
        json={"email": settings.seed_admin_email, "password": settings.seed_admin_password},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == settings.seed_admin_email
    token = data["access_token"]

    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["role"] == "admin"

    admin_res = client.get("/api/admin/overview", headers={"Authorization": f"Bearer {token}"})
    assert admin_res.status_code == 200


def test_student_login_success_and_admin_route_blocked(client: TestClient):
    res = client.post(
        "/api/auth/login",
        json={"email": settings.seed_student_email, "password": settings.seed_student_password},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "student"
    token = data["access_token"]

    student_res = client.get("/api/student/overview", headers={"Authorization": f"Bearer {token}"})
    assert student_res.status_code == 200

    # PB02: aluno não pode acessar funcionalidades de administrador
    forbidden = client.get("/api/admin/overview", headers={"Authorization": f"Bearer {token}"})
    assert forbidden.status_code == 403


def test_invalid_credentials_rejected(client: TestClient):
    res = client.post(
        "/api/auth/login",
        json={"email": settings.seed_admin_email, "password": "wrong-password"},
    )
    assert res.status_code == 401
    assert "detail" in res.json()

    unknown = client.post(
        "/api/auth/login",
        json={"email": "naoexiste@esimenade.com", "password": "123"},
    )
    assert unknown.status_code == 401


def test_protected_routes_require_token(client: TestClient):
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/admin/overview").status_code == 401
    assert client.get("/api/student/overview").status_code == 401
