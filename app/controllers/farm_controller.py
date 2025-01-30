from app.models import db, Farm
from flask import jsonify, request

class FarmController:
    """Controlador para gerenciar operações relacionadas a fazendas."""

    @staticmethod
    def create_farm():
        """Cria uma nova fazenda."""
        data = request.get_json()  
        
        # Verifica se o nome da fazenda é fornecido
        if not data or 'name' not in data:
            return jsonify({"error": "Nome da fazenda é obrigatório."}), 400
        
        try:
            # Cria uma nova instância do modelo Farm com os dados fornecidos
            new_farm = Farm(**data)
            db.session.add(new_farm)  
            db.session.commit()  

            return jsonify(new_farm.to_dict()), 201
            
        except Exception as e:
            db.session.rollback() 
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_farms():
        """Retorna todas as fazendas com opção de filtragem."""
        try:
            filters = {}
            name_filter = request.args.get('name')
            owner_filter = request.args.get('owner')
            location_filter = request.args.get('location')

            if name_filter:
                filters['name'] = name_filter
            if owner_filter:
                filters['owner_name'] = owner_filter
            if location_filter:
                filters['location'] = location_filter

            farms_query = Farm.query

            # Aplica filtros se existirem
            if filters:
                farms_query = farms_query.filter_by(**filters)

            farms = farms_query.all()  # Obtém todas as fazendas filtradas
            return jsonify([farm.to_dict() for farm in farms]), 200  
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_farm(farm_id):
        """Retorna uma fazenda específica pelo ID."""
        try:
            farm = db.session.get(Farm, farm_id)  

            if farm is None:
                return jsonify({"error": "Fazenda não encontrada."}), 404

            return jsonify(farm.to_dict()), 200 
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def update_farm(farm_id):
        """Atualiza os dados de uma fazenda existente."""
        data = request.get_json()  
        
        try:
            farm = db.session.get(Farm, farm_id)  

            if farm is None:
                return jsonify({"error": "Fazenda não encontrada."}), 404

            # Atualiza cada atributo da fazenda com os dados fornecidos
            for key, value in data.items():
                setattr(farm, key, value)

            db.session.commit()  # Comita as alterações no banco de dados
            return jsonify(farm.to_dict()), 200  
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def delete_farm(farm_id):
        """Remove uma fazenda do banco de dados."""
        try:
            farm = db.session.get(Farm, farm_id)  

            if farm is None:
                return jsonify({"error": "Fazenda não encontrada."}), 404

            db.session.delete(farm)  
            db.session.commit()  
            return jsonify({"message": "Fazenda excluída com sucesso."}), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500
