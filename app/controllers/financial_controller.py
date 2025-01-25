from app.models import db, FinancialTransaction, Farm
from flask import jsonify, request

class FinancialController:
    """Controlador para gerenciar operações relacionadas a transações financeiras."""

    @staticmethod
    def create_transaction():
        """Cria uma nova transação financeira."""
        data = request.get_json()  # Obtém os dados JSON da requisição
        
        if not data or 'description' not in data:
            return jsonify({"error": "Descrição da transação é obrigatória."}), 400

        if 'amount' not in data:
            return jsonify({"error": "O valor da transação (amount) é obrigatório."}), 400

        if 'transaction_type' not in data:
            return jsonify({"error": "O tipo de transação (transaction_type) é obrigatório."}), 400

        if 'farm_id' not in data:
            return jsonify({"error": "O ID da fazenda (farm_id) é obrigatório."}), 400

        # Verifica se a fazenda existe
        farm = Farm.query.get(data['farm_id'])
        if not farm:
            return jsonify({"error": f"Fazenda com ID {data['farm_id']} não encontrada."}), 404

        try:
            new_transaction = FinancialTransaction(**data)  # Cria uma nova instância do modelo FinancialTransaction
            db.session.add(new_transaction)  # Adiciona ao banco de dados
            db.session.commit()  # Salva as alterações

            return jsonify(new_transaction.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_transactions():
        """Retorna todas as transações financeiras."""
        try:
            transactions = FinancialTransaction.query.all()  # Obtém todas as transações
            return jsonify([transaction.to_dict() for transaction in transactions]), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_transaction(transaction_id):
        """Retorna uma transação específica pelo ID."""
        try:
            transaction = FinancialTransaction.query.get(transaction_id)  # Busca a transação pelo ID

            if transaction is None:
                return jsonify({"error": "Transação não encontrada."}), 404

            return jsonify(transaction.to_dict()), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def update_transaction(transaction_id):
        """Atualiza os dados de uma transação financeira existente."""
        data = request.get_json()  # Obtém os novos dados da requisição
        
        try:
            transaction = FinancialTransaction.query.get(transaction_id)  # Busca a transação pelo ID

            if transaction is None:
                return jsonify({"error": "Transação não encontrada."}), 404

            for key, value in data.items():
                setattr(transaction, key, value)  # Atualiza cada atributo da transação

            db.session.commit()  # Comita as alterações no banco de dados
            return jsonify(transaction.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def delete_transaction(transaction_id):
        """Remove uma transação do banco de dados."""
        try:
            transaction = FinancialTransaction.query.get(transaction_id)  # Busca a transação pelo ID

            if transaction is None:
                return jsonify({"error": "Transação não encontrada."}), 404

            db.session.delete(transaction)  # Remove a transação da sessão do banco de dados
            db.session.commit()  # Comita as alterações no banco de dados
            return jsonify({"message": "Transação excluída com sucesso."}), 200
            
        except Exception as e:
            db.session.rollback()  # Reverte alterações em caso de erro
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_financial_summary_by_farm(farm_id):
        """Retorna o resumo financeiro para uma fazenda específica."""
        try:
            total_income = db.session.query(db.func.sum(FinancialTransaction.amount)).filter(
                FinancialTransaction.farm_id == farm_id,
                FinancialTransaction.transaction_type == 'receita'
            ).scalar() or 0
            
            total_expense = db.session.query(db.func.sum(FinancialTransaction.amount)).filter(
                FinancialTransaction.farm_id == farm_id,
                FinancialTransaction.transaction_type == 'despesa'
            ).scalar() or 0
            
            summary = {
                "farm_id": farm_id,
                "total_income": total_income,
                "total_expense": total_expense,
                "net_balance": total_income - total_expense
            }
            
            return jsonify(summary), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_balance_by_period(start_date, end_date):
        """Retorna o balanço geral por período."""
        try:
            total_income = db.session.query(db.func.sum(FinancialTransaction.amount)).filter(
                FinancialTransaction.transaction_type == 'receita',
                FinancialTransaction.transaction_date.between(start_date, end_date)
            ).scalar() or 0
            
            total_expense = db.session.query(db.func.sum(FinancialTransaction.amount)).filter(
                FinancialTransaction.transaction_type == 'despesa',
                FinancialTransaction.transaction_date.between(start_date, end_date)
            ).scalar() or 0
            
            report = {
                "start_date": start_date,
                "end_date": end_date,
                "total_income": total_income,
                "total_expense": total_expense,
                "net_balance": total_income - total_expense
            }
            
            return jsonify(report), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
