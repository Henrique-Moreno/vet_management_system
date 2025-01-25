document.addEventListener('DOMContentLoaded', function () {
  const transactionsTableBody = document.getElementById('transactionsBody');

  // Função para carregar as transações na tabela
  function loadTransactions(filters = {}) {
    let query = new URLSearchParams(filters).toString();
    fetch(`http://127.0.0.1:8080/financial?${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar transações');
        }
        return response.json();
      })
      .then(data => {
        transactionsTableBody.innerHTML = ''; 
        data.forEach(transaction => {
          const row = document.createElement('tr');
          row.innerHTML = `
                      <td>${transaction.id}</td>
                      <td>${transaction.description}</td>
                      <td>${transaction.amount.toFixed(2)}</td> 
                      <td>${transaction.transaction_type}</td> 
                      <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td> 
                      <td>
                          <button onclick="editTransaction(${transaction.id})">Editar</button> 
                          <button onclick="deleteTransaction(${transaction.id})">Excluir</button>
                      </td>`;
          transactionsTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Erro ao carregar transações:', error));
  }

  // Função para abrir o modal
  function openModal() {
    document.getElementById('transactionModal').style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    document.getElementById('transactionModal').style.display = 'none';
  }

  // Evento para adicionar uma nova transação
  document.getElementById('addTransactionBtn').addEventListener('click', function () {
    openModal(); // Abre o modal para adicionar uma nova transação
    document.getElementById('modalTitle').innerText = 'Adicionar Transação';
    document.getElementById('transactionForm').reset(); 
    document.getElementById('transactionId').value = ''; 
  });

  // Evento para filtrar as transações com base nos inputs
  document.getElementById('filterBtn').addEventListener('click', function () {
    const descriptionFilter = document.getElementById('descriptionFilter').value.trim();
    const startDateFilter = document.getElementById('startDateFilter').value.trim();
    const endDateFilter = document.getElementById('endDateFilter').value.trim();

    const filters = {};
    if (descriptionFilter) filters.description = descriptionFilter;
    if (startDateFilter) filters.start_date = startDateFilter;
    if (endDateFilter) filters.end_date = endDateFilter;

    loadTransactions(filters); // Carrega as transações com os filtros aplicados
  });

  // Evento para salvar a transação 
  document.getElementById('transactionForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const transactionId = document.getElementById('transactionId').value;

    const transactionData = {
      description: document.getElementById('description').value.trim(),
      amount: parseFloat(document.getElementById('amount').value),
      transaction_type: document.getElementById('transactionType').value,
      transaction_date: document.getElementById('transactionDate').value,
      farm_id: parseInt(document.getElementById('farmId').value)
    };

    if (!transactionData.description || !transactionData.amount || !transactionData.transaction_type || !transactionData.transaction_date || !transactionData.farm_id) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    if (transactionId) { // Se um ID existir, atualiza a transação existente
      fetch(`http://127.0.0.1:8080/financial/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Transação atualizada com sucesso!');
          loadTransactions(); // Recarrega as transações na tabela
          closeModal(); // Fecha o modal após salvar
        })
        .catch(error => console.error('Erro ao atualizar a transação:', error));
    } else { // Caso contrário, cria uma nova transação
      fetch(`http://127.0.0.1:8080/financial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Transação criada com sucesso!');
          loadTransactions(); // Recarrega as transações na tabela
          closeModal(); // Fecha o modal após salvar
        })
        .catch(error => console.error('Erro ao criar a transação:', error));
    }
  });

  // Função para editar uma transação existente
  window.editTransaction = function (transactionId) {
    fetch(`http://127.0.0.1:8080/financial/${transactionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        openModal(); // Abre o modal para edição
        document.getElementById('modalTitle').innerText = 'Editar Transação';
        document.getElementById('description').value = data.description;
        document.getElementById('amount').value = data.amount.toFixed(2);
        document.getElementById('transactionType').value = data.transaction_type;
        document.getElementById('transactionDate').value = data.transaction_date.split("T")[0]; 
        document.getElementById('farmId').value = data.farm_id;
        document.getElementById('transactionId').value = transactionId; 
      })
      .catch(error => console.error('Erro ao buscar a transação:', error));
  };

  // Função para excluir uma transação existente
  window.deleteTransaction = function (transactionId) {
    if (confirm("Você tem certeza que deseja excluir esta transação?")) {
      fetch(`http://127.0.0.1:8080/financial/${transactionId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Transação excluída com sucesso!');
          loadTransactions(); 
        })
        .catch(error => console.error('Erro ao excluir a transação:', error));
    }
  };

  loadTransactions(); // Carrega as transações na tabela ao iniciar a página

});
