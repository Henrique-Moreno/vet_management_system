from app import db

class Service(db.Model):
    """Modelo que representa um serviço prestado"""
    
    id = db.Column(db.Integer, primary_key=True)  
    service_type = db.Column(db.String(100), nullable=False)  
    service_date = db.Column(db.Date, nullable=False)  
    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)  # Relacionamento com o animal
    farm_id = db.Column(db.Integer, db.ForeignKey('farm.id'), nullable=False)  # Relacionamento com a fazenda
    veterinarian_name = db.Column(db.String(90), nullable=False)  # Nome do veterinário responsável
    description = db.Column(db.Text)  # Descrição detalhada do serviço

    # Relacionamentos
    animal = db.relationship('Animal', backref='services')
    farm = db.relationship('Farm', backref='services')  # Relacionamento com a fazenda

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            "id": self.id,
            "service_type": self.service_type,
            "service_date": self.service_date.isoformat() if self.service_date else None,
            "animal_id": self.animal_id,
            "veterinarian_name": self.veterinarian_name,
            "description": self.description,
            "farm_id": self.farm_id  # Incluindo farm_id na representação
        }

    def __repr__(self):
        """Representação em string do modelo Service"""
        return f'<Service {self.service_type} for {self.animal.name} on {self.service_date}>'
