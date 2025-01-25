from app.models import db, Animal, Farm
from flask import jsonify, request

class AnimalController:
    """Controlador para gerenciar operações relacionadas a animais."""

    @staticmethod
    def create_animal():
        """Cria um novo animal."""
        data = request.get_json()  
        
        if not data or 'name' not in data:
            return jsonify({"error": "Nome do animal é obrigatório."}), 400
        
        if 'farm_id' not in data:
            return jsonify({"error": "O ID da fazenda (farm_id) é obrigatório."}), 400
        
        # Verifica se a fazenda existe
        farm = Farm.query.get(data["farm_id"])
        if not farm:
            return jsonify({"error": f"Fazenda com ID {data['farm_id']} não encontrada."}), 404

        # Valida se father_id e mother_id existem
        if 'father_id' in data and data['father_id'] is not None:
            father = Animal.query.get(data['father_id'])
            if not father:
                return jsonify({"error": f"Animal com ID {data['father_id']} (pai) não encontrado."}), 404

        if 'mother_id' in data and data['mother_id'] is not None:
            mother = Animal.query.get(data['mother_id'])
            if not mother:
                return jsonify({"error": f"Animal com ID {data['mother_id']} (mãe) não encontrado."}), 404

        try:
            # Cria uma nova instância do modelo Animal
            new_animal = Animal(**data)
            db.session.add(new_animal)  
            db.session.commit()  

            return jsonify(new_animal.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()  
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_animals():
        """Retorna todos os animais."""
        try:
            animals = Animal.query.all()  
            return jsonify([animal.to_dict() for animal in animals]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_animal(animal_id):
        """Retorna um animal específico pelo ID."""
        try:
            animal = Animal.query.get(animal_id)  

            if animal is None:
                return jsonify({"error": "Animal não encontrado."}), 404

            return jsonify(animal.to_dict()), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def update_animal(animal_id):
        """Atualiza os dados de um animal existente."""
        data = request.get_json()  
        
        try:
            animal = Animal.query.get(animal_id)  

            if animal is None:
                return jsonify({"error": "Animal não encontrado."}), 404

            for key, value in data.items():
                setattr(animal, key, value)  

            db.session.commit()  
            return jsonify(animal.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def delete_animal(animal_id):
        """Remove um animal do banco de dados."""
        try:
            animal = Animal.query.get(animal_id)  

            if animal is None:
                return jsonify({"error": "Animal não encontrado."}), 404

            db.session.delete(animal)  # Remove o animal da sessão do banco de dados
            db.session.commit()  # Comita as alterações no banco de dados
            return jsonify({"message": "Animal excluído com sucesso."}), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_family_tree(animal_id):
        """Retorna a árvore genealógica de um animal específico."""
        animal = Animal.query.get(animal_id)
        
        if not animal:
            return jsonify({"error": "Animal não encontrado."}), 404
        
        family_tree = animal.build_family_tree()
        
        return jsonify(family_tree), 200
    
    @staticmethod
    def get_animals_by_farm(farm_id):
        """Retorna todos os animais associados a uma fazenda específica."""
        try:
            animals = Animal.query.filter_by(farm_id=farm_id).all()
            return jsonify([animal.to_dict() for animal in animals]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_reproductive_history(animal_id):
        """Retorna o histórico reprodutivo de um animal específico."""
        try:
            animal = Animal.query.get(animal_id)
            if not animal:
                return jsonify({"error": "Animal não encontrado."}), 404
            
            reproductive_history = {
                "breeding_history": animal.breeding_history,  
                "birth_history": animal.birth_history         
            }
            
            return jsonify(reproductive_history), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
