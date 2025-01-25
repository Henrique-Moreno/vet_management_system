from flask import Blueprint, request, jsonify
from app.controllers.animal_controller import AnimalController

# Cria um Blueprint para rotas relacionadas a animais
animal_bp = Blueprint('animal', __name__)

@animal_bp.route('/', methods=['POST', 'OPTIONS'])
def create_animal():
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200  # Responde ao preflight request
    return AnimalController.create_animal()

@animal_bp.route('/', methods=['GET'])
def get_animals():
    """Rota para obter todos os animais."""
    return AnimalController.get_animals()

@animal_bp.route('/<int:animal_id>', methods=['GET'])
def get_animal(animal_id):
    """Rota para obter um animal específico pelo ID."""
    return AnimalController.get_animal(animal_id)

@animal_bp.route('/<int:animal_id>', methods=['PUT'])
def update_animal(animal_id):
    """Rota para atualizar um animal existente."""
    return AnimalController.update_animal(animal_id)

@animal_bp.route('/<int:animal_id>', methods=['DELETE'])
def delete_animal(animal_id):
    """Rota para remover um animal pelo ID."""
    return AnimalController.delete_animal(animal_id)

@animal_bp.route('/<int:animal_id>/family-tree', methods=['GET'])
def get_animal_family_tree(animal_id):
    """Rota para obter a árvore genealógica de um animal específico."""
    return AnimalController.get_family_tree(animal_id)

@animal_bp.route('/farm/<int:farm_id>', methods=['GET'])
def get_animals_by_farm(farm_id):
    """Rota para obter todos os animais por fazenda."""
    return AnimalController.get_animals_by_farm(farm_id)

@animal_bp.route('/<int:animal_id>/reproductive-history', methods=['GET'])
def get_reproductive_history(animal_id):
    """Rota para obter o histórico reprodutivo de um animal específico."""
    return AnimalController.get_reproductive_history(animal_id)
