import csv
from app import create_app
from app.models import db, FinancialTransaction, Animal, Farm, Service
from faker import Faker

def export_transactions(writer):
    """Exporta as transações financeiras para o CSV."""
    writer.writerow(['--- Transações Financeiras ---'])  # Cabeçalho
    writer.writerow(['ID', 'Description', 'Amount', 'Transaction Type', 'Transaction Date', 'Farm ID'])  # Sub-cabeçalho
    transactions = FinancialTransaction.query.all()
    for transaction in transactions:
        writer.writerow([
            transaction.id,
            transaction.description,
            transaction.amount,
            transaction.transaction_type,
            transaction.transaction_date.isoformat() if transaction.transaction_date else '',
            transaction.farm_id
        ])

def export_animals(writer):
    """Exporta os animais para o CSV."""
    writer.writerow(['--- Animais ---'])  # Cabeçalho
    writer.writerow(['ID', 'Name', 'Species', 'Breed', 'Gender', 'Birth Date', 'Weight', 'Farm ID'])  # Sub-cabeçalho
    animals = Animal.query.all()
    for animal in animals:
        writer.writerow([
            animal.id,
            animal.name,
            animal.species,
            animal.breed,
            animal.gender,
            animal.birth_date.isoformat() if animal.birth_date else '',
            animal.weight,
            animal.farm_id
        ])

def export_farms(writer):
    """Exporta as fazendas para o CSV."""
    writer.writerow(['--- Fazendas ---'])  # Cabeçalho
    writer.writerow(['ID', 'Name', 'Location', 'Owner Name', 'Owner Phone', 'Owner Email', 'Observations'])  # Sub-cabeçalho
    farms = Farm.query.all()
    for farm in farms:
        writer.writerow([
            farm.id,
            farm.name,
            farm.location,
            farm.owner_name,
            farm.owner_phone,
            farm.owner_email,
            farm.observations
        ])

def export_services(writer):
    """Exporta os serviços para o CSV."""
    writer.writerow(['--- Serviços ---'])  # Cabeçalho
    writer.writerow(['ID', 'Service Type', 'Service Date', 'Animal ID', 'Farm ID', 'Veterinarian Name', 'Description'])  # Sub-cabeçalho
    services = Service.query.all()
    for service in services:
        writer.writerow([
            service.id,
            service.service_type,
            service.service_date.isoformat() if service.service_date else '',
            service.animal_id,
            service.farm_id,
            service.veterinarian_name,
            service.description
        ])

def export_to_csv(filename):
    """Exporta dados das transações financeiras, animais, fazendas e serviços para um arquivo CSV."""
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        # Exportar transações financeiras
        export_transactions(writer)
        
        # Linha em branco entre seções
        writer.writerow([])
        
        # Exportar animais
        export_animals(writer)
        
        # Linha em branco entre seções
        writer.writerow([])
        
        # Exportar fazendas
        export_farms(writer)

        # Linha em branco entre seções
        writer.writerow([])

        # Exportar serviços
        export_services(writer)

    print(f'Dados exportados com sucesso para {filename}.')

if __name__ == '__main__':
    # Cria o contexto da aplicação Flask
    app = create_app()
    with app.app_context():
        export_to_csv('backup_data.csv')
