from typing import Any, Dict

from fastapi import APIRouter, Body

from app.schemas.validation import ValidationResult
from app.services.validator import validate_question_paper

router = APIRouter()


@router.post("/validate", response_model=ValidationResult)
def validate_paper(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    return validate_question_paper(payload)
