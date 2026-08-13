from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel


class TotalMarksCheck(BaseModel):
    expected: Optional[Union[int, float]] = None
    actual: Union[int, float]
    valid: bool


class MissingFieldEntry(BaseModel):
    question: Any
    fields: List[str]


class InvalidMarkEntry(BaseModel):
    question: Any
    marks: Any


class InvalidDifficultyEntry(BaseModel):
    question: Any
    difficulty: Any


class DifficultyStat(BaseModel):
    count: int
    percentage: float


class ValidationResult(BaseModel):
    valid: bool
    total_marks: TotalMarksCheck
    question_count: int
    duplicate_questions: int
    duplicates: List[Any]
    missing_fields: List[MissingFieldEntry]
    invalid_marks: List[InvalidMarkEntry]
    invalid_difficulty: List[InvalidDifficultyEntry]
    difficulty: Dict[str, DifficultyStat]
    topics: Dict[str, int]
