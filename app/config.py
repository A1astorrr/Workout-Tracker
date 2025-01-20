from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "name"
    DB_USER: str = "username"
    DB_PASS: str = "password"

    @property
    def Database_url(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    
    
    SECRET_KEY: str =  "secret_key"
    ALGORITHM: str = "algorithm"
    

 

    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
settings = Settings()
