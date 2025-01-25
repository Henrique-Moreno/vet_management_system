# app/scripts/backup.py

import csv
from app import create_app
from app.models import db, FinancialTransaction, Animal, Farm

def export_to_csv(filename):
    """Exporta dados das transações financeiras, animais e fazendas para um arquivo CSV."""
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Table', 'ID', 'Description', 'Amount', 'Transaction Type', 'Transaction Date', 'Farm ID', 'Name'])  # Cabeçalho
        
        # Exportar transações financeiras
        transactions = FinancialTransaction.query.all()
        for transaction in transactions:
            writer.writerow([
                'FinancialTransaction',
                transaction.id,
                transaction.description,
                transaction.amount,
                transaction.transaction_type,
                transaction.transaction_date.isoformat() if transaction.transaction_date else '',
                transaction.farm_id,
                ''
            ])
        
        # Exportar animais
        animals = Animal.query.all()
        for animal in animals:
            writer.writerow([
                'Animal',
                animal.id,
                '',
                '',
                '',
                '',
                animal.farm_id,
                animal.name
            ])
        
        # Exportar fazendas
        farms = Farm.query.all()
        for farm in farms:
            writer.writerow([
                'Farm',
                farm.id,
                '',
                '',
                '',
                '',
                '',
                farm.name
            ])

    print(f'Dados exportados com sucesso para {filename}.')

if __name__ == '__main__':
    # Cria o contexto da aplicação Flask
    app = create_app()
    with app.app_context():
        export_to_csv('backup_data.csv')
