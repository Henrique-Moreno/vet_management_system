from flask import jsonify, request
from flask_login import login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, Admin

class AdminController:
    """Controlador para gerenciar operações relacionadas a administradores."""

    @staticmethod
    def register():
        """Registra um novo administrador."""
        data = request.get_json()
        
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Nome de usuário e senha são obrigatórios."}), 400
        
        # Verifica se o nome de usuário já está em uso
        existing_admin = Admin.query.filter_by(username=data['username']).first()
        if existing_admin:
            return jsonify({"error": "Nome de usuário já está em uso."}), 400
        
        # Atualizado para usar pbkdf2:sha256
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        
        new_admin = Admin(username=data['username'], password=hashed_password)
        
        try:
            db.session.add(new_admin)
            db.session.commit()
            return jsonify({"message": "Administrador registrado com sucesso."}), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def login():
        """Realiza o login do administrador."""
        data = request.get_json()
        
        admin = Admin.query.filter_by(username=data['username']).first()
        
        if admin and check_password_hash(admin.password, data['password']):
            login_user(admin)
            return jsonify({"message": "Login bem-sucedido."}), 200
        
        return jsonify({"error": "Nome de usuário ou senha incorretos."}), 401

    @staticmethod
    def logout():
        """Realiza o logout do administrador."""
        logout_user()
        return jsonify({"message": "Logout bem-sucedido."}), 200

    @staticmethod
    def get_current_admin():
        """Retorna informações sobre o administrador atual."""
        if current_user.is_authenticated:
            return jsonify({"username": current_user.username}), 200
        
        return jsonify({"error": "Nenhum administrador autenticado."}), 401
        
