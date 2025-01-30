def test_create_transaction(client):
    """Teste para verificar a criação de uma nova transação financeira."""
    transaction_data = {
        'description': 'Venda de produtos',
        'amount': 1500.00,
        'transaction_type': 'receita',
        'transaction_date': '2025-01-26',
        'farm_id': 2  # Certifique-se de que a fazenda com ID 1 existe
    }

    response = client.post('/financial/', json=transaction_data)

    assert response.status_code == 201  # Verifica se a criação foi bem-sucedida
    data = response.get_json()
    assert data['description'] == transaction_data['description']  # Verifica se a descrição está correta
    assert data['amount'] == transaction_data['amount']  # Verifica se o valor está correto
    assert data['transaction_type'] == transaction_data['transaction_type']  # Verifica se o tipo está correto

def test_get_transactions(client):
    """Teste para verificar a obtenção de todas as transações financeiras."""
    # Primeiro, cria uma transação financeira
    client.post('/financial/', json={
        'description': 'Venda de produtos',
        'amount': 1500.00,
        'transaction_type': 'receita',
        'transaction_date': '2025-01-26',
        'farm_id': 2  
    })

    # Agora, faça uma requisição GET para obter todas as transações
    response = client.get('/financial/')

    assert response.status_code == 200  # Verifica se a requisição foi bem-sucedida
    data = response.get_json()
    assert len(data) > 0  # Verifica se há pelo menos uma transação na lista
