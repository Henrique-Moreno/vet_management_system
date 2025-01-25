import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

class Config:
    """Class de configuração da aplicação Flask"""

    # URL do banco de dados, usando PyMySql para conectar ao Mysql
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    # Desativa o rastreamento de modificações do SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY")