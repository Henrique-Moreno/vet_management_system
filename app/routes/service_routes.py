from flask import Blueprint, request
from app.controllers.service_controller import ServiceController

# Cria um Blueprint para rotas relacionadas a serviços
service_bp = Blueprint('service', __name__)

@service_bp.route('/', methods=['POST'])
def create_service():
    """Rota para criar um novo serviço."""
    return ServiceController.create_service()

@service_bp.route('/', methods=['GET'])
def get_services():
    """Rota para obter todos os serviços."""
    return ServiceController.get_services()

@service_bp.route('/<int:service_id>', methods=['GET'])
def get_service(service_id):
    """Rota para obter um serviço específico pelo ID."""
    return ServiceController.get_service(service_id)

@service_bp.route('/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    """Rota para atualizar um serviço existente."""
    return ServiceController.update_service(service_id)

@service_bp.route('/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    """Rota para remover um serviço pelo ID."""
    return ServiceController.delete_service(service_id)

@service_bp.route('/animal/<int:animal_id>', methods=['GET'])
def get_services_by_animal(animal_id):
    """Rota para obter serviços por animal."""
    return ServiceController.get_services_by_animal(animal_id)

@service_bp.route('/farm/<int:farm_id>', methods=['GET'])
def get_services_by_farm(farm_id):
    """Rota para obter serviços por fazenda."""
    return ServiceController.get_services_by_farm(farm_id)

@service_bp.route('/date-range', methods=['GET'])
def get_services_by_date_range():
    """Rota para obter serviços em um intervalo de datas."""
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    return ServiceController.get_services_by_date_range(start_date, end_date)

@service_bp.route('/services-by-period', methods=['GET'])
def get_services_by_period():
    """Rota para obter serviços prestados em um intervalo de datas."""
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    return ServiceController.get_services_by_period(start_date, end_date)


