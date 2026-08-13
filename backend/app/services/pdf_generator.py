from io import BytesIO
from typing import Any, Dict

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer

INSTITUTE_NAME = "CHARUSAT UNIVERSITY"

_STYLES = getSampleStyleSheet()

_INSTITUTE_STYLE = ParagraphStyle(
    "Institute", parent=_STYLES["Title"], alignment=TA_CENTER, fontSize=18, spaceAfter=6,
)
_EXAM_STYLE = ParagraphStyle(
    "Exam", parent=_STYLES["Heading2"], alignment=TA_CENTER, fontSize=13, spaceAfter=14,
)
_META_STYLE = ParagraphStyle(
    "Meta", parent=_STYLES["Normal"], alignment=TA_LEFT, fontSize=11, spaceAfter=4,
)
_QUESTION_STYLE = ParagraphStyle(
    "Question", parent=_STYLES["Normal"], alignment=TA_LEFT, fontSize=11, spaceAfter=2, leading=15,
)
_MARKS_STYLE = ParagraphStyle(
    "Marks", parent=_STYLES["Normal"], alignment=TA_RIGHT, fontSize=10,
    textColor=colors.HexColor("#333333"), spaceAfter=10,
)


def generate_question_paper_pdf(payload: Dict[str, Any]) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        title="Question Paper",
    )

    elements = [
        Paragraph(INSTITUTE_NAME, _INSTITUTE_STYLE),
        Paragraph(str(payload.get("exam", "")), _EXAM_STYLE),
        Paragraph(f"Subject: {payload.get('subject', '')}", _META_STYLE),
        Paragraph(f"Duration: {payload.get('duration', '')}", _META_STYLE),
        Paragraph(f"Maximum Marks: {payload.get('total_marks', '')}", _META_STYLE),
        Spacer(1, 8),
        HRFlowable(width="100%", thickness=1, color=colors.black),
        Spacer(1, 12),
    ]

    for question in payload.get("questions") or []:
        number = question.get("number", "")
        text = question.get("question", "")
        marks = question.get("marks", "")
        elements.append(Paragraph(f"Q{number}. {text}", _QUESTION_STYLE))
        elements.append(Paragraph(f"[{marks} Marks]", _MARKS_STYLE))

    elements.append(HRFlowable(width="100%", thickness=1, color=colors.black))

    doc.build(elements)
    return buffer.getvalue()
