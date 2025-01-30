from app import db
class Farm(db.Model):
    """Modelo que representa uma fazenda."""

    id = db.Column(db.Integer, primary_key=True)  
    name = db.Column(db.String(90), nullable=False)  
    location = db.Column(db.String(200))  
    owner_name = db.Column(db.String(90))  
    owner_phone = db.Column(db.String(15))  
    owner_email = db.Column(db.String(100)) 
    observations = db.Column(db.Text)  

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "owner_name": self.owner_name,
            "owner_phone": self.owner_phone,
            "owner_email": self.owner_email,
            "observations": self.observations,
        }

    def __repr__(self):
        """Representação em string do modelo Farm."""
        return f'<Farm {self.name}>'
