import csv
from app import create_app
from app.models import db, FinancialTransaction, Animal, Farm, Service

def import_from_csv(filename):
    """Importa dados de um arquivo CSV para o banco de dados."""
    with open(filename, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        current_section = None  # Variável para rastrear a seção atual

        for row in reader:
            # Verifica se é um separador de seção (linha com '---')
            if row[0].startswith('---'):
                current_section = row[0].strip('-').strip()
                continue  # Pula para a próxima linha

            # Ignora linhas em branco ou inválidas
            if not row or not current_section:
                continue

            # Processa cada seção com base no cabeçalho
            if current_section == 'Transações Financeiras':
                transaction = FinancialTransaction(
                    id=int(row[0]),
                    description=row[1],
                    amount=float(row[2]) if row[2] else 0.0,
                    transaction_type=row[3],
                    transaction_date=row[4] if row[4] else None,
                    farm_id=int(row[5]) if row[5] else None
                )
                db.session.add(transaction)

            elif current_section == 'Animais':
                animal = Animal(
                    id=int(row[0]),
                    name=row[1],
                    species=row[2],
                    breed=row[3],
                    gender=row[4],
                    birth_date=row[5] if row[5] else None,
                    weight=float(row[6]) if row[6] else None,
                    farm_id=int(row[7]) if row[7] else None
                )
                db.session.add(animal)

            elif current_section == 'Fazendas':
                farm = Farm(
                    id=int(row[0]),
                    name=row[1],
                    location=row[2],
                    owner_name=row[3],
                    owner_phone=row[4],
                    owner_email=row[5],
                    observations=row[6]
                )
                db.session.add(farm)

            elif current_section == 'Serviços':
                service = Service(
                    id=int(row[0]),
                    service_type=row[1],
                    service_date=row[2] if row[2] else None,
                    animal_id=int(row[3]) if row[3] else None,
                    farm_id=int(row[4]) if row[4] else None,
                    veterinarian_name=row[5],
                    description=row[6]
                )
                db.session.add(service)

    db.session.commit()
    print(f'Dados importados com sucesso de {filename}.')

if __name__ == '__main__':
    # Cria o contexto da aplicação Flask
    app = create_app()
    with app.app_context():
        import_from_csv('backup_data.csv')
