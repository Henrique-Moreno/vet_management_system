from app import db

class FinancialTransaction(db.Model):
    """Modelo que representa uma transação financeira"""
    
    id = db.Column(db.Integer, primary_key=True)  
    description = db.Column(db.String(200), nullable=False)  
    amount = db.Column(db.Float, nullable=False)  
    transaction_type = db.Column(db.String(15), nullable=False)  # Tipo (receita ou despesa)
    transaction_date = db.Column(db.Date, nullable=False)  # Data da transação
    farm_id = db.Column(db.Integer, db.ForeignKey('farm.id'))  # Relacionamento com a fazenda

    # Relacionamento com o modelo Farm
    farm = db.relationship('Farm', backref='financial_transactions')

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            "id": self.id,
            "description": self.description,
            "amount": self.amount,
            "transaction_type": self.transaction_type,
            "transaction_date": self.transaction_date.isoformat() if self.transaction_date else None,
            "farm_id": self.farm_id
        }

    def __repr__(self):
        """Representação em string do modelo FinancialTransaction"""
        return f'<FinancialTransaction {self.transaction_type}: {self.description} of {self.amount} on {self.transaction_date}>'
