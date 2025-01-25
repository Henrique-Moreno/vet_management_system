from flask import Blueprint
from app.routes.farm_routes import farm_bp 
from app.routes.animal_routes import animal_bp
from app.routes.service_routes import service_bp
from app.routes.financial_routes import financial_bp
from app.routes.admin_routes import admin_bp

def register_routes(app):
    """Registra todos os Blueprints no aplicativo Flask."""
    app.register_blueprint(farm_bp, url_prefix="/farms")

    app.register_blueprint(animal_bp, url_prefix="/animals")

    app.register_blueprint(service_bp, url_prefix="/services")

    app.register_blueprint(financial_bp, url_prefix="/financial")

    app.register_blueprint(admin_bp, url_prefix="/admins")

