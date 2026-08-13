from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import generate_pdf, health, validate
from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(validate.router, prefix=settings.api_prefix)
app.include_router(generate_pdf.router, prefix=settings.api_prefix)


@app.get("/")
def read_root() -> dict:
    return {"service": settings.app_name, "status": "running"}
