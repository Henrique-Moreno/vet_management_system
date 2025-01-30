from app import create_app, db
from app.models import Admin, Animal, Farm, Service, FinancialTransaction
from faker import Faker
from werkzeug.security import generate_password_hash 

# Inicializa a aplicação e a biblioteca Faker
app = create_app()
fake = Faker()

def populate_database():
    with app.app_context():
        # Cria o administrador padrão
        admin = Admin(
            username="userAdmin",
            password=generate_password_hash("12345")
        )
        db.session.add(admin)

        # Cria administradores adicionais com dados falsos
        for _ in range(1): # Crie quantos administradores adicionais desejar
            admin = Admin(
                username=fake.user_name(),
                password=generate_password_hash(fake.password())  # Use um hash real 
            )
            db.session.add(admin)

        db.session.commit()  # Salva os administradores no banco

        # Cria 2 fazendas
        farm1 = Farm(
            name="Fazenda Boa Esperança",
            location="São Paulo, SP",
            owner_name="João da Silva",
            owner_phone="(11) 98765-4321",
            owner_email="joaoSilva@fazendaesperanca.com",
            observations="Fazenda especializada em produção de leite e derivados."
        )
        db.session.add(farm1)

        farm2 = Farm(
            name="Fazenda Recanto Feliz",
            location="Minas Gerais, MG",
            owner_name="Maria Oliveira",
            owner_phone="(31) 99876-5432",
            owner_email="maria.oliveira@gmail.com",
            observations="Fazenda voltada para cultivo de café orgânico."
        )
        db.session.add(farm2)

        db.session.commit()  # Salva os administradores e fazendas no banco

        # Cria 4 animais: pai, mãe, filho e neto
        father = Animal(
            name="Rex",
            species='Bovino',
            breed='Nelore',
            gender='Macho',
            birth_date=fake.date_of_birth(minimum_age=3, maximum_age=8),
            weight=850,
            farm_id=farm1.id,
            father_id=None,
            mother_id=None,
        )

        mother = Animal(
            name="Lola",
            species='Bovino',
            breed='Holandesa',
            gender='Fêmea',
            birth_date=fake.date_of_birth(minimum_age=3, maximum_age=8),
            weight=620,
            farm_id=farm1.id,
            father_id=None,
            mother_id=None,
        )

        child = Animal(
            name="Bobby",
            species='Bovino',
            breed='Angus',
            gender=fake.random_element(elements=['Macho', 'Fêmea']),
            birth_date=fake.date_of_birth(minimum_age=0, maximum_age=2),
            weight=320,
            farm_id=farm1.id,
            father_id=father.id,
            mother_id=mother.id,
        )

        # Cria a mãe do neto
        mother_of_grandchild = Animal(
            name="Bella",
            species='Bovino',
            breed='Angus',
            gender='Fêmea',
            birth_date=fake.date_of_birth(minimum_age=0, maximum_age=2),
            weight=300,
            farm_id=farm1.id,
            father_id=None,
            mother_id=None,
        )

        grandchild = Animal(
            name="Junior",
            species='Bovino',
            breed='Angus-Nelore',
            gender=fake.random_element(elements=['Macho', 'Fêmea']),
            birth_date=fake.date_of_birth(minimum_age=0, maximum_age=1),
            weight=150,
            farm_id=farm1.id,
            father_id=child.id,
            mother_id=mother_of_grandchild.id,  # Associando a mãe ao neto
        )

        # Adiciona os animais ao banco de dados
        db.session.add(father)
        db.session.add(mother)
        db.session.add(child)
        db.session.add(mother_of_grandchild)  # Adiciona a mãe do neto
        db.session.add(grandchild)

        db.session.commit()  # Salva os animais no banco

        # Cria alguns serviços associados aos animais
        animals = Animal.query.all()
        for animal in animals:
            for _ in range(2):  # Dois serviços por animal
                service = Service(
                    service_type='Consulta Veterinária',
                    service_date=fake.date_this_year(),
                    animal_id=animal.id,
                    farm_id=animal.farm_id,
                    veterinarian_name=fake.name(),
                    description=fake.sentence()
                )
                db.session.add(service)

        db.session.commit()  # Salva os serviços no banco

        # Cria algumas transações financeiras associadas às fazendas
        farms = Farm.query.all()
        
        for farm in farms:
            for _ in range(2):  # Três transações por fazenda
                transaction = FinancialTransaction(
                    transaction_type=fake.random_element(elements=['Receita', 'Despesa']),
                    amount=fake.random_number(digits=5),  # Valor aleatório até R$99.999
                    transaction_date=fake.date_this_year(),
                    description=fake.sentence(),
                    farm_id=farm.id
                )
                db.session.add(transaction)

        db.session.commit()  # Salva as transações financeiras no banco

if __name__ == "__main__":
    populate_database()
