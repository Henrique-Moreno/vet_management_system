from flask import Blueprint
from app.controllers.admin_controller import AdminController

# Cria um Blueprint para rotas relacionadas a administradores
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/register', methods=['POST'])
def register():
    """Rota para registrar um novo administrador."""
    return AdminController.register()

@admin_bp.route('/login', methods=['POST'])
def login():
    """Rota para realizar login do administrador."""
    return AdminController.login()

@admin_bp.route('/logout', methods=['POST'])
def logout():
    """Rota para realizar logout do administrador."""
    return AdminController.logout()

@admin_bp.route('/current', methods=['GET'])
def get_current_admin():
    """Rota para obter informações sobre o administrador atual."""
    return AdminController.get_current_admin()
