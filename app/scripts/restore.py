# app/scripts/restore.py

import csv
from app import create_app
from app.models import db, FinancialTransaction, Animal, Farm

def import_from_csv(filename):
    """Importa dados de um arquivo CSV para o banco de dados."""
    with open(filename, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # Ignora o cabeçalho
        
        for row in reader:
            if row[0] == 'FinancialTransaction':
                transaction = FinancialTransaction(
                    id=row[1],
                    description=row[2],
                    amount=float(row[3]) if row[3] else 0.0,
                    transaction_type=row[4],
                    transaction_date=row[5] if row[5] else None,
                    farm_id=int(row[6]) if row[6] else None
                )
                db.session.add(transaction)

            elif row[0] == 'Animal':
                animal = Animal(
                    id=row[1],
                    name=row[7],
                    farm_id=int(row[6]) if row[6] else None,
                    # Adicione outros campos conforme necessário
                )
                db.session.add(animal)

            elif row[0] == 'Farm':
                farm = Farm(
                    id=row[1],
                    name=row[7]
                    # Adicione outros campos conforme necessário
                )
                db.session.add(farm)

    db.session.commit()
    print(f'Dados importados com sucesso de {filename}.')

if __name__ == '__main__':
    # Cria o contexto da aplicação Flask
    app = create_app()
    with app.app_context():
        import_from_csv('backup_data.csv')
