from flask import Blueprint, request
from flask_login import login_required
from app.controllers.farm_controller import FarmController

# Cria um Blueprint para rotas relacionadas a fazendas
farm_bp = Blueprint('farm', __name__)

@farm_bp.route('/', methods=['POST'])
def create_farm():
    """Rota para criar uma nova fazenda."""
    return FarmController.create_farm()

@farm_bp.route('/', methods=['GET'])
def get_farms():
    """Rota para retornar todas as fazendas com opção de filtragem."""
    return FarmController.get_farms()

@farm_bp.route('/<int:farm_id>', methods=['GET'])
def get_farm(farm_id):
    """Rota para obter uma fazenda específica pelo ID."""
    return FarmController.get_farm(farm_id)

@farm_bp.route('/<int:farm_id>', methods=['PUT'])
def update_farm(farm_id):
    """Rota para atualizar uma fazenda existente."""
    return FarmController.update_farm(farm_id)

@farm_bp.route('/<int:farm_id>', methods=['DELETE'])
def delete_farm(farm_id):
    """Rota para remover uma fazenda pelo ID."""
    return FarmController.delete_farm(farm_id)
