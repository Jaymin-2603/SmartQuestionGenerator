from typing import Any, Dict

from fastapi import APIRouter, Body
from fastapi.responses import Response

from app.services.pdf_generator import generate_question_paper_pdf

router = APIRouter()


@router.post("/generate-pdf")
def generate_pdf(payload: Dict[str, Any] = Body(...)) -> Response:
    pdf_bytes = generate_question_paper_pdf(payload)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=question-paper.pdf"},
    )
