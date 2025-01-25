// web/js/farm_management.js

document.addEventListener('DOMContentLoaded', function () {
  const farmsTableBody = document.getElementById('farmsBody');

  // Função para carregar as fazendas na tabela
  function loadFarms(filters = {}) {
    let query = new URLSearchParams(filters).toString();
    fetch(`http://127.0.0.1:8080/farms?${query}`)
      .then(response => response.json())
      .then(data => {
        farmsTableBody.innerHTML = ''; // Limpa a tabela antes de preencher
        data.forEach(farm => {
          const row = document.createElement('tr');
          row.innerHTML = `
                      <td>${farm.id}</td>
                      <td>${farm.name}</td>
                      <td>${farm.owner_name || 'N/A'}</td>
                      <td>${farm.location || 'N/A'}</td>
                      <td>
                          <button onclick="editFarm(${farm.id})">Editar</button> 
                          <button onclick="deleteFarm(${farm.id})">Excluir</button>
                      </td>`;
          farmsTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Erro ao carregar fazendas:', error));
  }

  // Função para abrir o modal
  function openModal() {
    document.getElementById('farmModal').style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    document.getElementById('farmModal').style.display = 'none';
  }

  // Função específica para criar uma nova fazenda
  function createFarm(farmData) {
    fetch(`http://127.0.0.1:8080/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmData),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Fazenda criada com sucesso!');
        loadFarms(); // Recarrega as fazendas na tabela
        closeModal(); // Fecha o modal após salvar
      })
      .catch(error => console.error('Erro ao criar a fazenda:', error));
  }

  // Evento para adicionar uma nova fazenda
  document.getElementById('addFarmBtn').addEventListener('click', function () {
    openModal(); // Abre o modal para adicionar uma nova fazenda
    document.getElementById('modalTitle').innerText = 'Adicionar Fazenda';
    document.getElementById('farmForm').reset(); // Limpa o formulário
    document.getElementById('farmId').value = ''; // Limpa o ID
  });

  // Evento para filtrar as fazendas com base nos inputs
  document.getElementById('filterBtn').addEventListener('click', function () {
    const nameFilter = document.getElementById('nameFilter').value;
    const ownerFilter = document.getElementById('ownerFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;

    const filters = {};
    if (nameFilter) filters.name = nameFilter;
    if (ownerFilter) filters.owner_name = ownerFilter;
    if (locationFilter) filters.location = locationFilter;

    loadFarms(filters); // Carrega as fazendas com os filtros aplicados
  });

  // Evento para salvar a fazenda (adicionar ou editar)
  document.getElementById('farmForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const farmId = document.getElementById('farmId').value;

    const farmData = {
      name: document.getElementById('farmName').value,
      owner_name: document.getElementById('ownerName').value,
      owner_phone: document.getElementById('ownerPhone').value,
      owner_email: document.getElementById('ownerEmail').value,
      location: document.getElementById('location').value,
      observations: document.getElementById('observations').value,
    };

    if (farmId) { // Se um ID existir, atualiza a fazenda existente
      fetch(`http://127.0.0.1:8080/farms/${farmId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Fazenda atualizada com sucesso!');
          loadFarms(); // Recarrega as fazendas na tabela
          closeModal(); // Fecha o modal após salvar
        })
        .catch(error => console.error('Erro ao atualizar a fazenda:', error));
    } else { // Caso contrário, cria uma nova fazenda
      createFarm(farmData); // Usa a função específica para criar a fazenda
    }
  });


  // Função para editar uma fazenda existente
  window.editFarm = function (farmId) {
    fetch(`http://127.0.0.1:8080/farms/${farmId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        openModal(); // Abre o modal para edição
        document.getElementById('modalTitle').innerText = 'Editar Fazenda';
        document.getElementById('farmName').value = data.name;
        document.getElementById('ownerName').value = data.owner_name || '';
        document.getElementById('ownerPhone').value = data.owner_phone || '';
        document.getElementById('ownerEmail').value = data.owner_email || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('observations').value = data.observations || '';
        document.getElementById('farmId').value = farmId; // Define o ID no campo oculto
      })
      .catch(error => console.error('Erro ao buscar a fazenda:', error));
  };

  // Função para excluir uma fazenda existente
  window.deleteFarm = function (farmId) {
    if (confirm("Você tem certeza que deseja excluir esta fazenda?")) {
      fetch(`http://127.0.0.1:8080/farms/${farmId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Fazenda excluída com sucesso!');
          loadFarms(); // Recarrega as fazendas na tabela após exclusão
        })
        .catch(error => console.error('Erro ao excluir a fazenda:', error));
    }
  };

  loadFarms(); // Carrega as fazendas na tabela ao iniciar a página

});
