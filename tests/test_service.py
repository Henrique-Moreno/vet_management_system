def test_create_service(client):
    """Teste para verificar a criação de um novo serviço."""
    # Primeiro, crie uma fazenda e um animal 
    client.post('/farms/', json={
        'name': 'Fazenda Teste',
        'location': 'Localização Teste',
        'owner_name': 'Proprietário Teste',
        'owner_phone': '123456789',
        'owner_email': 'proprietario@test.com',
        'observations': 'Observações Teste'
    })
    
    client.post('/animals/', json={
        'name': 'Animal Teste',
        'species': 'Bovino',
        'age': 2,
        'farm_id': 3  
    })

    service_data = {
        'service_type': 'Consulta Veterinária',
        'service_date': '2025-01-26',
        'animal_id': 18,  
        'farm_id': 3,    
        'veterinarian_name': 'Dr. João',
        'description': 'Consulta geral do animal.'
    }

    response = client.post('/services/', json=service_data)

    assert response.status_code == 201  # Verifica se a criação foi bem-sucedida
    data = response.get_json()
    assert data['service_type'] == service_data['service_type']  # Verifica se o tipo de serviço está correto
    assert data['animal_id'] == service_data['animal_id']  # Verifica se o ID do animal está correto

def test_get_services(client):
    """Teste para verificar a obtenção de todos os serviços."""
    # Primeiro, cria um serviço financeiro
    client.post('/services/', json={
        'service_type': 'Consulta Veterinária',
        'service_date': '2025-01-26',
        'animal_id': 18,  
        'farm_id': 3,    
        'veterinarian_name': 'Dr. João',
        'description': 'Consulta geral do animal.'
    })

    # Agora, faça uma requisição GET para obter todos os serviços
    response = client.get('/services/')

    assert response.status_code == 200  # Verifica se a requisição foi bem-sucedida
    data = response.get_json()
    assert len(data) > 0  # Verifica se há pelo menos um serviço na lista
