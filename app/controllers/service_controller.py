from app.models import db, Service, Animal
from flask import jsonify, request

class ServiceController:
    """Controlador para gerenciar operações relacionadas a serviços."""

    @staticmethod
    def create_service():
        """Cria um novo serviço."""
        data = request.get_json()  # Obtém os dados JSON da requisição
        
        if not data or 'service_type' not in data:
            return jsonify({"error": "Tipo de serviço é obrigatório."}), 400

        if 'animal_id' not in data:
            return jsonify({"error": "O ID do animal (animal_id) é obrigatório."}), 400

        # Verifica se o animal existe
        animal = db.session.get(Animal, data['animal_id'])
        if not animal:
            return jsonify({"error": f"Animal com ID {data['animal_id']} não encontrado."}), 404

        try:
            new_service = Service(**data)  # Cria uma nova instância do modelo Service
            db.session.add(new_service)  # Adiciona ao banco de dados
            db.session.commit()  # Salva as alterações

            return jsonify(new_service.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_services():
        """Retorna todos os serviços."""
        try:
            services = Service.query.all()  # Obtém todos os serviços
            return jsonify([service.to_dict() for service in services]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_service(service_id):
        """Retorna um serviço específico pelo ID."""
        try:
            service = db.session.get(Service, service_id)  # Busca o serviço pelo ID

            if service is None:
                return jsonify({"error": "Serviço não encontrado."}), 404

            return jsonify(service.to_dict()), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def update_service(service_id):
        """Atualiza os dados de um serviço existente."""
        data = request.get_json()  # Obtém os novos dados da requisição
        
        try:
            service = db.session.get(Service, service_id)  # Busca o serviço pelo ID

            if service is None:
                return jsonify({"error": "Serviço não encontrado."}), 404

            # Atualiza cada atributo do serviço com os dados fornecidos
            for key, value in data.items():
                setattr(service, key, value)  

            db.session.commit()  # Comita as alterações no banco de dados
            return jsonify(service.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def delete_service(service_id):
        """Remove um serviço do banco de dados."""
        try:
            service = db.session.get(Service, service_id)  # Busca o serviço pelo ID

            if service is None:
                return jsonify({"error": "Serviço não encontrado."}), 404

            db.session.delete(service)  # Remove o serviço da sessão do banco de dados
            db.session.commit()  # Comita as alterações no banco de dados
            return jsonify({"message": "Serviço excluído com sucesso."}), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_services_by_animal(animal_id):
        """Retorna todos os serviços prestados a um animal específico."""
        try:
            services = Service.query.filter_by(animal_id=animal_id).all()
            return jsonify([service.to_dict() for service in services]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_services_by_farm(farm_id):
        """Retorna todos os serviços prestados em uma fazenda específica."""
        try:
            services = Service.query.filter_by(farm_id=farm_id).all()
            return jsonify([service.to_dict() for service in services]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_services_by_date_range(start_date, end_date):
        """Retorna todos os serviços prestados em um intervalo de datas."""
        try:
            services = Service.query.filter(Service.service_date.between(start_date, end_date)).all()
            return jsonify([service.to_dict() for service in services]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    @staticmethod
    def get_services_by_period(start_date, end_date):
        """Retorna todos os serviços prestados em um intervalo de datas."""
        try:
            services = Service.query.filter(Service.service_date.between(start_date, end_date)).all()
            return jsonify([service.to_dict() for service in services]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
