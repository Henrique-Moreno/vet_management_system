document.addEventListener('DOMContentLoaded', function () {
  const servicesTableBody = document.getElementById('servicesBody');

  // Função para carregar os serviços na tabela
  function loadServices(filters = {}) {
    let query = new URLSearchParams(filters).toString();
    fetch(`http://127.0.0.1:8080/services?${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar serviços');
        }
        return response.json();
      })
      .then(data => {
        servicesTableBody.innerHTML = ''; 
        data.forEach(service => {
          const row = document.createElement('tr');
          row.innerHTML = `
                      <td>${service.id}</td>
                      <td>${service.service_type}</td>
                      <td>${new Date(service.service_date).toLocaleDateString()}</td> 
                      <td>${service.animal_id}</td> 
                      <td>${service.farm_id}</td> 
                      <td>${service.veterinarian_name}</td> 
                      <td>
                          <button onclick="editService(${service.id})">Editar</button> 
                          <button onclick="deleteService(${service.id})">Excluir</button>
                      </td>`;
          servicesTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Erro ao carregar serviços:', error));
  }

  // Função para abrir o modal
  function openModal() {
    document.getElementById('serviceModal').style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    document.getElementById('serviceModal').style.display = 'none';
  }

  // Evento para adicionar um novo serviço
  document.getElementById('addServiceBtn').addEventListener('click', function () {
    openModal(); // Abre o modal para adicionar um novo serviço
    document.getElementById('modalTitle').innerText = 'Adicionar Serviço';
    document.getElementById('serviceForm').reset(); 
    document.getElementById('serviceId').value = ''; 
  });

  // Evento para filtrar os serviços com base nos inputs
  document.getElementById('filterBtn').addEventListener('click', function () {
    const serviceTypeFilter = document.getElementById('serviceTypeFilter').value.trim();
    const veterinarianFilter = document.getElementById('veterinarianFilter').value.trim();
    const startDateFilter = document.getElementById('startDateFilter').value.trim();
    const endDateFilter = document.getElementById('endDateFilter').value.trim();

    const filters = {};
    if (serviceTypeFilter) filters.service_type = serviceTypeFilter;
    if (veterinarianFilter) filters.veterinarian_name = veterinarianFilter;
    if (startDateFilter) filters.start_date = startDateFilter;
    if (endDateFilter) filters.end_date = endDateFilter;

    loadServices(filters); // Carrega os serviços com os filtros aplicados
  });

  // Evento para salvar o serviço (adicionar ou editar)
  document.getElementById('serviceForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const serviceId = document.getElementById('serviceId').value;

    const serviceData = {
      service_type: document.getElementById('serviceType').value.trim(),
      service_date: document.getElementById('serviceDate').value,
      animal_id: parseInt(document.getElementById('animalId').value),
      farm_id: parseInt(document.getElementById('farmId').value),
      veterinarian_name: document.getElementById('veterinarianName').value.trim(),
      description: document.getElementById('description').value.trim(),
    };

    if (!serviceData.service_type || !serviceData.service_date || !serviceData.animal_id || !serviceData.farm_id || !serviceData.veterinarian_name) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    if (serviceId) { 
      fetch(`http://127.0.0.1:8080/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Serviço atualizado com sucesso!');
          loadServices(); 
          closeModal(); 
        })
        .catch(error => console.error('Erro ao atualizar o serviço:', error));
    } else { 
      fetch(`http://127.0.0.1:8080/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Serviço criado com sucesso!');
          loadServices(); 
          closeModal(); 
        })
        .catch(error => console.error('Erro ao criar o serviço:', error));
    }
  });

  // Função para editar um serviço existente
  window.editService = function (serviceId) {
    fetch(`http://127.0.0.1:8080/services/${serviceId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        openModal(); // Abre o modal para edição
        document.getElementById('modalTitle').innerText = 'Editar Serviço';
        document.getElementById('serviceType').value = data.service_type;
        document.getElementById('serviceDate').value = data.service_date.split("T")[0]; 
        document.getElementById('animalId').value = data.animal_id;
        document.getElementById('farmId').value = data.farm_id;
        document.getElementById('veterinarianName').value = data.veterinarian_name;
        document.getElementById('description').value = data.description || '';
        document.getElementById('serviceId').value = serviceId; 
      })
      .catch(error => console.error('Erro ao buscar o serviço:', error));
  };

  // Função para excluir um serviço existente
  window.deleteService = function (serviceId) {
    if (confirm("Você tem certeza que deseja excluir este serviço?")) {
      fetch(`http://127.0.0.1:8080/services/${serviceId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Serviço excluído com sucesso!');
          loadServices(); 
        })
        .catch(error => console.error('Erro ao excluir o serviço:', error));
    }
  };

  loadServices(); // Carrega os serviços na tabela ao iniciar a página

});
Z