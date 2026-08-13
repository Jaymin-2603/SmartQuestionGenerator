from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Smart Question Paper Generator"
    api_prefix: str = "/api"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "gemma3:4b"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
