from flask import Blueprint, request
from app.controllers.financial_controller import FinancialController

# Cria um Blueprint para rotas relacionadas a transações financeiras
financial_bp = Blueprint('financial', __name__)

@financial_bp.route('/', methods=['POST'])
def create_transaction():
    """Rota para criar uma nova transação financeira."""
    return FinancialController.create_transaction()

@financial_bp.route('/', methods=['GET'])
def get_transactions():
    """Rota para obter todas as transações financeiras."""
    return FinancialController.get_transactions()

@financial_bp.route('/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    """Rota para obter uma transação específica pelo ID."""
    return FinancialController.get_transaction(transaction_id)

@financial_bp.route('/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    """Rota para atualizar uma transação financeira existente."""
    return FinancialController.update_transaction(transaction_id)

@financial_bp.route('/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Rota para remover uma transação pelo ID."""
    return FinancialController.delete_transaction(transaction_id)

@financial_bp.route('/farm/<int:farm_id>', methods=['GET'])
def get_financial_report_by_farm(farm_id):
    """Rota para obter o total de receitas e despesas por fazenda."""
    return FinancialController.get_financial_summary_by_farm(farm_id)

@financial_bp.route('/balance', methods=['GET'])
def get_balance_by_period():
    """Rota para obter o balanço geral por período."""
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    return FinancialController.get_balance_by_period(start_date, end_date)

@financial_bp.route('/summary/farm/<int:farm_id>', methods=['GET'])
def get_financial_summary_by_farm(farm_id):
    """Rota para obter o resumo financeiro por fazenda."""
    return FinancialController.get_financial_summary_by_farm(farm_id)
