"""Backend tests for Minecraft Fractions API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cubic-fraction-quest.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_health(client):
    r = client.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_root(client):
    r = client.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "Minecraft" in data.get("message", "")


# ---------- LLM problem generation ----------
def _validate_problem(data, topic, difficulty):
    for k in ["id", "topic", "difficulty", "question", "choices", "correct_index", "explanation", "minecraft_flavor"]:
        assert k in data, f"missing key {k}"
    assert data["topic"] == topic
    assert data["difficulty"] == difficulty
    assert isinstance(data["choices"], list) and len(data["choices"]) == 4
    assert all(isinstance(c, str) for c in data["choices"])
    assert isinstance(data["correct_index"], int)
    assert 0 <= data["correct_index"] <= 3
    assert len(data["question"]) > 0
    assert len(data["explanation"]) > 0


@pytest.mark.parametrize("topic,difficulty", [
    ("word", "easy"),
    ("add", "easy"),
    ("subtract", "medium"),
    ("compare", "hard"),
])
def test_generate_problem(client, topic, difficulty):
    r = client.post(
        f"{BASE_URL}/api/problems/generate",
        json={"topic": topic, "difficulty": difficulty},
        timeout=60,
    )
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:300]}"
    _validate_problem(r.json(), topic, difficulty)


def test_generate_defaults(client):
    r = client.post(f"{BASE_URL}/api/problems/generate", json={}, timeout=60)
    assert r.status_code == 200
    _validate_problem(r.json(), "word", "easy")
