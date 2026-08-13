import json
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

MOCK_PATH = Path(__file__).parent / "mock_question_paper.json"
client = TestClient(app)


def load_mock():
    with open(MOCK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def test_validate_endpoint_returns_valid_result():
    response = client.post("/api/validate", json=load_mock())

    assert response.status_code == 200
    body = response.json()
    assert body["valid"] is True
    assert body["question_count"] == 6


def test_validate_endpoint_flags_invalid_paper():
    payload = load_mock()
    payload["questions"][0]["marks"] = -1

    response = client.post("/api/validate", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["valid"] is False
    assert len(body["invalid_marks"]) == 1


def test_generate_pdf_endpoint_returns_pdf():
    response = client.post("/api/generate-pdf", json=load_mock())

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["content-disposition"] == "attachment; filename=question-paper.pdf"
    assert response.content.startswith(b"%PDF")


def test_health_endpoint_unaffected():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "smart-question-paper-generator"}
