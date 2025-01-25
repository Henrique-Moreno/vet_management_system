from app import db

class Animal(db.Model):
    """Modelo que representa um animal"""
    
    id = db.Column(db.Integer, primary_key=True)  
    name = db.Column(db.String(90), nullable=False)  # Nome do animal
    species = db.Column(db.String(50))  # Espécie (bovino, ovino, equino, etc.)
    breed = db.Column(db.String(50))  # Raça
    gender = db.Column(db.String(15))  # Sexo (Macho ou Fêmea)
    birth_date = db.Column(db.Date)  # Data de nascimento
    weight = db.Column(db.Float)  # Peso em kg

    farm_id = db.Column(db.Integer, db.ForeignKey('farm.id'))  # Relacionamento com a fazenda
    farm = db.relationship('Farm', backref='animals')  # Relacionamento reverso com a fazenda

    health_history = db.Column(db.Text)  # Histórico de saúde (vacinas, exames, tratamentos)

    # Controle de reprodução
    father_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=True)  # ID do pai
    mother_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=True)  # ID da mãe

    father = db.relationship('Animal', remote_side=[id], foreign_keys=[father_id], backref='offspring_as_father')  # Relacionamento com o pai
    mother = db.relationship('Animal', remote_side=[id], foreign_keys=[mother_id], backref='offspring_as_mother')  # Relacionamento com a mãe

    pregnancy_status = db.Column(db.Boolean, default=False)  # Status da prenhez (True se estiver prenha)
    
    breeding_history = db.Column(db.JSON, nullable=True)  # Registro de cruzamentos (JSON)
    birth_history = db.Column(db.JSON, nullable=True)  # Histórico de partos (JSON)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            "id": self.id,
            "name": self.name,
            "species": self.species,
            "breed": self.breed,
            "gender": self.gender,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "weight": self.weight,
            "farm_id": self.farm_id,
            "health_history": self.health_history,
            "father_id": self.father_id,
            "mother_id": self.mother_id,
            "pregnancy_status": self.pregnancy_status,
            "breeding_history": self.breeding_history,
            "birth_history": self.birth_history
        }

    def __repr__(self):
        """Representação em string do modelo Animal."""
        return f'<Animal {self.name}>'

    def build_family_tree(self, visited=None):
        """Constrói a árvore genealógica para este animal, evitando ciclos."""
        if visited is None:
            visited = set()  # Inicializa o conjunto de visitados

        # Verifica se o animal já foi visitado
        if self.id in visited:
            return None  # Retorna None para evitar ciclos

        # Adiciona o animal ao conjunto de visitados
        visited.add(self.id)

        family_tree = {
            "id": self.id,
            "name": self.name,
            "father": None,
            "mother": None,
            "children": []
        }

        # Adiciona o pai à árvore
        if self.father:
            family_tree["father"] = self.father.build_family_tree(visited)

        # Adiciona a mãe à árvore
        if self.mother:
            family_tree["mother"] = self.mother.build_family_tree(visited)

        # Adiciona os filhos à árvore
        children = Animal.query.filter((Animal.father_id == self.id) | (Animal.mother_id == self.id)).all()
        for child in children:
            family_tree["children"].append(child.build_family_tree(visited))

        return family_tree
