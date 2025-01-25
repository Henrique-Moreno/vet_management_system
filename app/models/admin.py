from app import db
from flask_login import UserMixin

class Admin(db.Model, UserMixin):
    """Modelo que representa um administrador do sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Admin {self.username}>'
