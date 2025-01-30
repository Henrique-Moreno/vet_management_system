def test_create_animal(client):
    """Teste para verificar a criação de um novo animal."""
    # Primeiro, crie uma fazenda
    client.post('/farms/', json={
        'name': 'Fazenda Teste',
        'location': 'Localização Teste',
        'owner_name': 'Proprietário Teste',
        'owner_phone': '123456789',
        'owner_email': 'proprietario@test.com',
        'observations': 'Observações Teste'
    })

    animal_data = {
        'name': 'Animal Teste',
        'species': 'Bovino',
        'breed': 'Nelore',
        'gender': 'Macho',
        'birth_date': '2023-01-01',
        'weight': 300.0,
        'farm_id': 2  
    }

    response = client.post('/animals/', json=animal_data)

    assert response.status_code == 201  # Verifica se a criação foi bem-sucedida
    data = response.get_json()
    assert data['name'] == animal_data['name']  # Verifica se o nome está correto
    assert data['species'] == animal_data['species']  # Verifica se a espécie está correta

def test_get_animals(client):
    """Teste para verificar a obtenção de todos os animais."""
    # Primeiro, cria um animal
    client.post('/animals/', json={
        'name': 'Animal Teste',
        'species': 'Bovino',
        'breed': 'Nelore',
        'gender': 'Macho',
        'birth_date': '2023-01-01',
        'weight': 300.0,
        'farm_id': 2  
    })

    # Agora, faça uma requisição GET para obter todos os animais
    response = client.get('/animals/')

    assert response.status_code == 200  # Verifica se a requisição foi bem-sucedida
    data = response.get_json()
    assert len(data) > 0  # Verifica se há pelo menos um animal na lista
