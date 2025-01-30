const createTransactionForm = document.getElementById('createTransactionForm');
const editTransactionForm = document.getElementById('editTransactionForm');
const dynamicFilterForm = document.getElementById('dynamicFilterForm');
const balanceForm = document.getElementById('balanceForm');
const transactionsTableBody = document.querySelector('#transactionsTable tbody');
const balanceResult = document.getElementById('balanceResult');
const filterOption = document.getElementById('filterOption');
const dynamicInputContainer = document.getElementById('dynamicInputContainer');
const filterResult = document.getElementById('filterResult');

// Função para criar uma transação financeira
async function createTransaction(data) {
  try {
    const response = await fetch('http://localhost:8080/financial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível criar a transação.`);

    const result = await response.json();
    alert(`Transação criada com sucesso! ID: ${result.id}`);
    fetchTransactions();
    return result;
  } catch (error) {
    alert(`Erro ao criar transação: ${error.message}`);
  }
}

// Função para editar uma transação financeira
async function editTransaction(id, data) {
  try {
    const response = await fetch(`http://localhost:8080/financial/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível editar a transação.`);

    alert('Transação editada com sucesso!');
    fetchTransactions();
  } catch (error) {
    alert(`Erro ao editar transação: ${error.message}`);
  }
}

// Função para buscar todas as transações financeiras
async function fetchTransactions(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:8080/financial?${queryString}`);

    if (!response.ok) throw new Error('Erro ao buscar transações.');

    const transactions = await response.json();

    transactionsTableBody.innerHTML = '';

    transactions.forEach((transaction) => {
      const row = document.createElement('tr');

      row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>${transaction.transaction_type}</td>
                <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td><button onclick='loadEditForm(${transaction.id})'>Editar</button><button onclick='deleteTransaction(${transaction.id})'>Deletar</button></td>`;

      transactionsTableBody.appendChild(row);
    });
  } catch (error) {
    alert(`Erro ao buscar transações financeiras: ${error.message}`);
  }
}

// Função para buscar informações com base na rota selecionada
async function fetchData(route, id) {
  try {
    const response = await fetch(`http://localhost:8080/financial/${route}/${id}`);

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível buscar os dados.`);

    const data = await response.json();

    // Renderiza os resultados com base na rota
    if (route === "summary/farm") {
      filterResult.innerHTML = `
        <p><strong>ID da Fazenda:</strong> ${data.farm_id}</p>
        <p><strong>Saldo Líquido:</strong> R$ ${data.net_balance.toFixed(2)}</p>
        <p><strong>Total de Receitas:</strong> R$ ${data.total_income.toFixed(2)}</p>
        <p><strong>Total de Despesas:</strong> R$ ${data.total_expense.toFixed(2)}</p>`;
    } else if (route === "farm") {
      filterResult.innerHTML = `
        <p><strong>ID da Fazenda:</strong> ${data.farm_id}</p>
        <p><strong>Saldo Líquido:</strong> R$ ${data.net_balance.toFixed(2)}</p>
        <p><strong>Total de Receitas:</strong> R$ ${data.total_income.toFixed(2)}</p>
        <p><strong>Total de Despesas:</strong> R$ ${data.total_expense.toFixed(2)}</p>`;
    } else {
      filterResult.innerHTML = `
        <p><strong>ID da Transação:</strong> ${data.id}</p>
        <p><strong>Descrição:</strong> ${data.description}</p>
        <p><strong>Valor:</strong> R$ ${data.amount.toFixed(2)}</p>
        <p><strong>Tipo de Transação:</strong> ${data.transaction_type}</p>
        <p><strong>ID da Fazenda:</strong> ${data.farm_id}</p>
        <p><strong>Data da Transação:</strong> ${new Date(data.transaction_date).toLocaleDateString()}</p>`;
    }
  } catch (error) {
    alert(`Erro ao buscar dados: ${error.message}`);
  }
}

// Atualiza o input dinâmico com base na opção selecionada
function updateDynamicInput() {
  const selectedOption = filterOption.value;

  dynamicInputContainer.innerHTML = '';

  if (selectedOption === 'summary/farm') {
    dynamicInputContainer.innerHTML = `
      <label for="filterFarmSummaryId">ID da Fazenda (Resumo):</label>
      <input type="number" id="filterFarmSummaryId" name="farm_summary_id" required>`;
  } else if (selectedOption === 'farm') {
    dynamicInputContainer.innerHTML = `
      <label for="filterFarmId">ID da Fazenda:</label>
      <input type="number" id="filterFarmId" name="farm_id" required>`;
  } else if (selectedOption === 'transaction') {
    dynamicInputContainer.innerHTML = `
      <label for="filterTransactionId">ID da Transação:</label>
      <input type="number" id="filterTransactionId" name="transaction_id" required>`;
  }
}

// Manipulador de evento para o formulário de filtro dinâmico
dynamicFilterForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const selectedOption = filterOption.value;

  if (selectedOption === 'summary/farm') {
    const farmSummaryId = document.getElementById('filterFarmSummaryId').value;
    await fetchData("summary/farm", farmSummaryId);
  } else if (selectedOption === 'farm') {
    const farmId = document.getElementById('filterFarmId').value;
    await fetchData("farm", farmId);
  } else if (selectedOption === 'transaction') {
    const transactionId = document.getElementById('filterTransactionId').value;
    await fetchData("", transactionId); // "" porque a rota é `financial/{id}`
  }
});

// Função para consultar o balanço geral por período
async function fetchBalance(startDate, endDate) {
  try {
    const response = await fetch(`http://localhost:8080/financial/balance?start=${startDate}&end=${endDate}`);

    if (!response.ok) throw new Error('Erro ao buscar o balanço.');

    const balance = await response.json();

    balanceResult.innerHTML = `
      <p><strong>Data Inicial:</strong> ${startDate}</p>
      <p><strong>Data Final:</strong> ${endDate}</p>
      <p><strong>Total de Receitas:</strong> R$ ${balance.total_income.toFixed(2)}</p>
      <p><strong>Total de Despesas:</strong> R$ ${balance.total_expense.toFixed(2)}</p>
      <p><strong>Saldo Líquido:</strong> R$ ${balance.net_balance.toFixed(2)}</p>`;
  } catch (error) {
    alert(`Erro ao buscar balanço: ${error.message}`);
  }
}

// Manipulador de evento para o formulário de balanço
balanceForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const startDate = document.getElementById('balanceStartDate').value;
  const endDate = document.getElementById('balanceEndDate').value;

  if (new Date(startDate) > new Date(endDate)) {
    alert('A data inicial não pode ser maior que a data final.');
    return;
  }

  await fetchBalance(startDate, endDate);
});

// Carrega dados no formulário de edição
async function loadEditForm(id) {
  try {
    const response = await fetch(`http://localhost:8080/financial/${id}`);

    if (!response.ok) throw new Error('Erro ao buscar dados da transação.');

    const transaction = await response.json();

    document.getElementById('editTransactionId').value = transaction.id;
    document.getElementById('editDescription').value = transaction.description;
    document.getElementById('editAmount').value = transaction.amount;
    document.getElementById('editTransactionType').value = transaction.transaction_type;
    document.getElementById('editTransactionDate').value = transaction.transaction_date ? new Date(transaction.transaction_date).toISOString().split('T')[0] : '';
    document.getElementById('editFarmId').value = transaction.farm_id;

    window.scrollTo(0, document.getElementById('editSection').offsetTop);
  } catch (error) {
    alert(`Erro ao carregar dados da transação para edição: ${error.message}`);
  }
}

// Função para deletar uma transação financeira
async function deleteTransaction(id) {
  if (confirm('Tem certeza que deseja deletar esta transação?')) {
    try {
      const response = await fetch(`http://localhost:8080/financial/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Erro ao deletar transação.');

      alert('Transação deletada com sucesso!');
      fetchTransactions();
    } catch (error) {
      alert(`Erro ao deletar transação: ${error.message}`);
    }
  }
}

// Manipuladores de evento dos formulários
createTransactionForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(createTransactionForm);

  await createTransaction(Object.fromEntries(formData));

  createTransactionForm.reset();
});

editTransactionForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(editTransactionForm);

  const data = Object.fromEntries(formData);

  await editTransaction(data.id, data);

  editTransactionForm.reset();
});

filterOption.addEventListener('change', updateDynamicInput);

// Inicializa a página carregando as transações cadastradas
document.addEventListener('DOMContentLoaded', () => {
  fetchTransactions();
});
