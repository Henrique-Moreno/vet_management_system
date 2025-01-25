from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from app.config import Config

# Inicializa as extensões fora da função create_app()
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app():
    """Cria e configura a aplicação Flask."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Habilita CORS globalmente com suporte a credenciais
    CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}}, 
         supports_credentials=True, 
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Inicializa as extensões com a aplicação
    db.init_app(app)
    migrate.init_app(app, db)

    # Inicializa o LoginManager com a aplicação Flask
    login_manager.init_app(app)

    # Importa os modelos para garantir que sejam reconhecidos pelo Flask-Migrate
    from app.models.admin import Admin

    @login_manager.user_loader
    def load_user(admin_id):
        """Carrega um administrador pelo ID."""
        return Admin.query.get(int(admin_id))

    # Importa e registra as rotas (Blueprints)
    from app.routes import register_routes
    register_routes(app)

    @app.route('/')
    def home():
        """Rota inicial da aplicação."""
        return "Bem-Vindo ao sistema ERP"

    return app
