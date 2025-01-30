import pytest
from app import create_app, db

@pytest.fixture
def app():
    """Configura uma aplicação Flask em modo de teste."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Usando banco de dados em memória
    
    with app.app_context():
        db.create_all()  # Cria todas as tabelas no banco de dados em memória
        yield app  # Retorna a aplicação para ser usada nos testes

@pytest.fixture
def client(app):
    """Configura um cliente de teste."""
    return app.test_client()
