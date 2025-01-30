def test_create_farm(client):
    """Teste para verificar a criação de uma nova fazenda."""
    farm_data = {
        'name': 'Fazenda Teste',
        'location': 'Localização Teste',
        'owner_name': 'Proprietário Teste',
        'owner_phone': '123456789',
        'owner_email': 'proprietario@test.com',
        'observations': 'Observações Teste'
    }

    response = client.post('/farms/', json=farm_data)

    assert response.status_code == 201  # Verifica se a criação foi bem-sucedida
    data = response.get_json()
    assert data['name'] == farm_data['name']  # Verifica se o nome está correto

def test_get_farms(client):
    """Teste para verificar a obtenção de todas as fazendas."""
    client.post('/farms/', json={
        'name': 'Fazenda Teste',
        'location': 'Localização Teste',
        'owner_name': 'Proprietário Teste',
        'owner_phone': '123456789',
        'owner_email': 'proprietario@test.com',
        'observations': 'Observações Teste'
    })

    response = client.get('/farms/')
    
    assert response.status_code == 200  
    data = response.get_json()
    assert len(data) > 0  # Verifica se há pelo menos uma fazenda na lista
