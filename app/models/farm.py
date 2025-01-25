from app import db

class Farm(db.Model):
    """Modelo que representa uma fazenda."""

    id = db.Column(db.Integer, primary_key=True)  # Identificador único da fazenda
    name = db.Column(db.String(90), nullable=False)  # Nome da fazenda
    location = db.Column(db.String(200))  # Localização da fazenda (endereço completo ou coordenadas)
    owner_name = db.Column(db.String(90))  # Nome do proprietário da fazenda
    owner_phone = db.Column(db.String(15))  # Telefone do proprietário
    owner_email = db.Column(db.String(100))  # E-mail do proprietário
    observations = db.Column(db.Text)  # Observações adicionais sobre a fazenda

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
