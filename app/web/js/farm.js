const createFarmForm = document.getElementById('createFarmForm');
const editFarmForm = document.getElementById('editFarmForm');
const filterFarmForm = document.getElementById('filterFarmForm');
const farmsTableBody = document.querySelector('#farmsTable tbody');

// Função para buscar todas as fazendas com filtros
async function fetchFarms(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString(); // Converte filtros em string de consulta
    const response = await fetch(`http://localhost:8080/farms?${queryString}`);

    if (!response.ok) throw new Error('Erro ao buscar fazendas.');

    const farms = await response.json();

    farmsTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    farms.forEach((farm) => {
      const row = document.createElement('tr');

      row.innerHTML = `
                <td>${farm.id}</td>
                <td>${farm.name}</td>
                <td>${farm.location}</td>
                <td>${farm.owner_name}</td>
                <td><button onclick='loadEditForm(${farm.id})'>Editar</button><button onclick='deleteFarm(${farm.id})'>Deletar</button></td>`;

      farmsTableBody.appendChild(row);
    });
  } catch (error) {
    alert(`Erro ao buscar fazendas: ${error.message}`);
  }
}

// Manipulador de evento para o formulário de filtro
filterFarmForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const filters = {
    name: document.getElementById('filterName').value,
    owner: document.getElementById('filterOwner').value,
    location: document.getElementById('filterLocation').value,
  };

  await fetchFarms(filters); // Chama a função com os filtros
});

// Função para criar uma fazenda
async function createFarm(data) {
  try {
    const response = await fetch('http://localhost:8080/farms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível criar a fazenda.`);

    const result = await response.json();
    alert(`Fazenda criada com sucesso! ID: ${result.id}`);

    fetchFarms();
  } catch (error) {
    alert(`Erro ao criar fazenda: ${error.message}`);
  }
}

// Função para editar uma fazenda
async function editFarm(id, data) {
  try {
    const response = await fetch(`http://localhost:8080/farms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível editar a fazenda.`);

    alert('Fazenda editada com sucesso!');

    fetchFarms();
  } catch (error) {
    alert(`Erro ao editar fazenda: ${error.message}`);
  }
}

// Função para carregar dados no formulário de edição
async function loadEditForm(id) {
  try {
    const response = await fetch(`http://localhost:8080/farms/${id}`);

    if (!response.ok) throw new Error('Erro ao buscar dados da fazenda.');

    const farm = await response.json();

    // Preenche o formulário de edição com os dados da fazenda
    document.getElementById('editFarmId').value = farm.id;
    document.getElementById('editName').value = farm.name;
    document.getElementById('editLocation').value = farm.location;
    document.getElementById('editOwnerName').value = farm.owner_name;
    document.getElementById('editOwnerPhone').value = farm.owner_phone;
    document.getElementById('editOwnerEmail').value = farm.owner_email;
    document.getElementById('editObservations').value = farm.observations;

    window.scrollTo(0, document.getElementById('editSection').offsetTop); // Rola até o formulário de edição
  } catch (error) {
    alert(`Erro ao carregar dados da fazenda para edição: ${error.message}`);
  }
}

// Função para deletar uma fazenda
async function deleteFarm(id) {
  if (confirm('Tem certeza que deseja deletar esta fazenda?')) {
    try {
      const response = await fetch(`http://localhost:8080/farms/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Erro ao deletar fazenda.');

      alert('Fazenda deletada com sucesso!');
      fetchFarms();
    } catch (error) {
      alert(`Erro ao deletar fazenda: ${error.message}`);
    }
  }
}

// Manipuladores de evento dos formulários
createFarmForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(createFarmForm);

  await createFarm(Object.fromEntries(formData));

  createFarmForm.reset();
});

// Manipulador de evento para o formulário de edição
editFarmForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(editFarmForm);

  const data = Object.fromEntries(formData);

  await editFarm(data.id, data);

  editFarmForm.reset();
});

// Inicializa a página carregando as fazendas cadastradas
document.addEventListener('DOMContentLoaded', () => fetchFarms());
