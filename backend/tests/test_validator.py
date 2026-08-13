import copy
import json
from pathlib import Path

from app.services.validator import validate_question_paper

MOCK_PATH = Path(__file__).parent / "mock_question_paper.json"


def load_mock():
    with open(MOCK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def test_valid_paper():
    payload = load_mock()
    result = validate_question_paper(payload)

    assert result["valid"] is True
    assert result["total_marks"] == {"expected": 20, "actual": 20, "valid": True}
    assert result["question_count"] == 6
    assert result["duplicate_questions"] == 0
    assert result["missing_fields"] == []
    assert result["invalid_marks"] == []
    assert result["invalid_difficulty"] == []


def test_incorrect_total_marks():
    payload = load_mock()
    payload["total_marks"] = 50

    result = validate_question_paper(payload)

    assert result["valid"] is False
    assert result["total_marks"]["expected"] == 50
    assert result["total_marks"]["actual"] == 20
    assert result["total_marks"]["valid"] is False


def test_duplicate_question_detected():
    payload = load_mock()
    duplicate = copy.deepcopy(payload["questions"][0])
    duplicate["number"] = 7
    duplicate["question"] = " " + payload["questions"][0]["question"].upper() + "  "
    payload["questions"].append(duplicate)

    result = validate_question_paper(payload)

    assert result["duplicate_questions"] > 0
    assert set(result["duplicates"]) == {1, 7}
    assert result["valid"] is False


def test_missing_field_detected():
    payload = load_mock()
    del payload["questions"][0]["topic"]

    result = validate_question_paper(payload)

    assert result["missing_fields"] == [{"question": 1, "fields": ["topic"]}]
    assert result["valid"] is False


def test_invalid_difficulty_detected():
    payload = load_mock()
    payload["questions"][0]["difficulty"] = "Extreme"

    result = validate_question_paper(payload)

    assert result["invalid_difficulty"] == [{"question": 1, "difficulty": "Extreme"}]
    assert result["valid"] is False


def test_invalid_marks_detected():
    payload = load_mock()
    payload["questions"][0]["marks"] = 0

    result = validate_question_paper(payload)

    assert result["invalid_marks"] == [{"question": 1, "marks": 0}]
    assert result["valid"] is False


def test_difficulty_and_topic_distribution():
    payload = load_mock()
    result = validate_question_paper(payload)

    assert result["difficulty"]["Easy"]["count"] == 2
    assert result["difficulty"]["Medium"]["count"] == 3
    assert result["difficulty"]["Hard"]["count"] == 1
    assert result["topics"] == {
        "Stacks": 1,
        "Queues": 1,
        "Graphs": 1,
        "Trees": 1,
        "Arrays": 1,
        "Linked Lists": 1,
    }
