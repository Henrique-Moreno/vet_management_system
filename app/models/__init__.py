from app import db  

from app.models.farm import Farm

from app.models.animal import Animal

from app.models.service import Service

from app.models.financial import FinancialTransaction

from app.models.admin import Admin

__all__ = ["db", "Farm", "Animal", "Service", "FinancialTransaction", "Admin"]  # Torna esses objetos acessíveis ao importar o módulo models
