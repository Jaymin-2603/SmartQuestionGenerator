# Backend — Smart Question Paper Generator

FastAPI backend for the Smart Question Paper Generator.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

- API root: http://localhost:8000
- Health check: http://localhost:8000/api/health
- Validate a question paper: `POST http://localhost:8000/api/validate`
- Generate a PDF: `POST http://localhost:8000/api/generate-pdf`
- Swagger docs: http://localhost:8000/docs

## Tests

```bash
python -m pytest tests/ -v
```

Uses `tests/mock_question_paper.json` as sample Phase 2 output so validation and PDF generation can be developed and tested independently of the generation service.

## Status

Phase 1: project setup complete.
Phase 3: question paper validation (`app/services/validator.py`) and PDF generation (`app/services/pdf_generator.py`) implemented.
Phase 2 (AI generation via Ollama) is being implemented separately and is not part of this codebase yet.
