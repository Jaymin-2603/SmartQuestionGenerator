from collections import defaultdict
from typing import Any, Dict, List

REQUIRED_QUESTION_FIELDS = ["number", "question", "marks", "difficulty", "topic"]
ALLOWED_DIFFICULTIES = ["Easy", "Medium", "Hard"]


def _normalize_question_text(text: str) -> str:
    return " ".join(text.strip().lower().split())


def _question_identifier(question: Dict[str, Any], index: int) -> Any:
    number = question.get("number")
    return number if number not in (None, "") else index + 1


def _is_present(question: Dict[str, Any], field: str) -> bool:
    return field in question and question.get(field) not in (None, "")


def _check_total_marks(payload: Dict[str, Any], questions: List[Dict[str, Any]]) -> Dict[str, Any]:
    expected = payload.get("total_marks")
    actual = 0
    for question in questions:
        marks = question.get("marks")
        if isinstance(marks, (int, float)) and not isinstance(marks, bool):
            actual += marks

    valid = expected is not None and actual == expected
    return {"expected": expected, "actual": actual, "valid": valid}


def _check_duplicates(questions: List[Dict[str, Any]]) -> tuple[int, List[Any]]:
    groups: Dict[str, List[Any]] = defaultdict(list)
    for index, question in enumerate(questions):
        text = question.get("question")
        if not isinstance(text, str) or not text.strip():
            continue
        normalized = _normalize_question_text(text)
        groups[normalized].append(_question_identifier(question, index))

    duplicate_groups = [numbers for numbers in groups.values() if len(numbers) > 1]
    duplicates: List[Any] = sorted(
        {number for group in duplicate_groups for number in group},
        key=lambda value: (str(type(value)), value),
    )
    return len(duplicate_groups), duplicates


def _check_missing_fields(questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    missing = []
    for index, question in enumerate(questions):
        missing_keys = [field for field in REQUIRED_QUESTION_FIELDS if not _is_present(question, field)]
        if missing_keys:
            missing.append({"question": _question_identifier(question, index), "fields": missing_keys})
    return missing


def _check_invalid_marks(questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    invalid = []
    for index, question in enumerate(questions):
        if not _is_present(question, "marks"):
            continue
        marks = question.get("marks")
        if isinstance(marks, bool) or not isinstance(marks, (int, float)) or marks <= 0:
            invalid.append({"question": _question_identifier(question, index), "marks": marks})
    return invalid


def _check_invalid_difficulty(questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    invalid = []
    for index, question in enumerate(questions):
        if not _is_present(question, "difficulty"):
            continue
        difficulty = question.get("difficulty")
        if difficulty not in ALLOWED_DIFFICULTIES:
            invalid.append({"question": _question_identifier(question, index), "difficulty": difficulty})
    return invalid


def _difficulty_distribution(questions: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    total = len(questions)
    counts = {level: 0 for level in ALLOWED_DIFFICULTIES}
    for question in questions:
        difficulty = question.get("difficulty")
        if difficulty in counts:
            counts[difficulty] += 1

    distribution = {}
    for level, count in counts.items():
        percentage = round((count / total) * 100, 2) if total else 0.0
        distribution[level] = {"count": count, "percentage": percentage}
    return distribution


def _topic_distribution(questions: List[Dict[str, Any]]) -> Dict[str, int]:
    topics: Dict[str, int] = {}
    for question in questions:
        topic = question.get("topic")
        if isinstance(topic, str) and topic.strip():
            topics[topic] = topics.get(topic, 0) + 1
    return topics


def validate_question_paper(payload: Dict[str, Any]) -> Dict[str, Any]:
    questions = payload.get("questions") or []

    total_marks = _check_total_marks(payload, questions)
    duplicate_count, duplicates = _check_duplicates(questions)
    missing_fields = _check_missing_fields(questions)
    invalid_marks = _check_invalid_marks(questions)
    invalid_difficulty = _check_invalid_difficulty(questions)

    is_valid = (
        total_marks["valid"]
        and duplicate_count == 0
        and not missing_fields
        and not invalid_marks
        and not invalid_difficulty
    )

    return {
        "valid": is_valid,
        "total_marks": total_marks,
        "question_count": len(questions),
        "duplicate_questions": duplicate_count,
        "duplicates": duplicates,
        "missing_fields": missing_fields,
        "invalid_marks": invalid_marks,
        "invalid_difficulty": invalid_difficulty,
        "difficulty": _difficulty_distribution(questions),
        "topics": _topic_distribution(questions),
    }
