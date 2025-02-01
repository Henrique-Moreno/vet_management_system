const createServiceForm = document.getElementById('createServiceForm');
const editServiceForm = document.getElementById('editServiceForm');
const servicesTableBody = document.querySelector('#servicesTable tbody');

// Função para criar um serviço
async function createService(data) {
  try {
    const response = await fetch('http://localhost:8080/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível criar o serviço.`);

    const result = await response.json();
    alert(`Serviço criado com sucesso! ID: ${result.id}`);
    fetchServices(); // Atualiza a tabela
  } catch (error) {
    alert(`Erro ao criar serviço: ${error.message}`);
  }
}

// Função para buscar todos os serviços
async function fetchServices(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString(); // Converte filtros em string de consulta
    const response = await fetch(`http://localhost:8080/services?${queryString}`);

    if (!response.ok) throw new Error('Erro ao buscar serviços.');

    const services = await response.json();

    servicesTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    services.forEach((service) => {
      const row = document.createElement('tr');

      row.innerHTML = `
                <td>${service.id}</td>
                <td>${service.service_type}</td>
                <td>${new Date(service.service_date).toLocaleDateString()}</td> <!-- Formata a data -->
                <td>${service.veterinarian_name}</td>
                <td><button onclick='loadEditForm(${service.id})'>Editar</button><button onclick='deleteService(${service.id})'>Deletar</button></td>`;

      servicesTableBody.appendChild(row);
    });
  } catch (error) {
    alert(`Erro ao buscar serviços: ${error.message}`);
  }
}

// Função para editar um serviço
async function editService(id, data) {
  try {
    const response = await fetch(`http://localhost:8080/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível editar o serviço.`);

    alert('Serviço editado com sucesso!');
    fetchServices(); // Atualiza a tabela
  } catch (error) {
    alert(`Erro ao editar serviço: ${error.message}`);
  }
}

// Carrega dados no formulário de edição
async function loadEditForm(id) {
  try {
    const response = await fetch(`http://localhost:8080/services/${id}`);

    if (!response.ok) throw new Error('Erro ao buscar dados do serviço.');

    const service = await response.json();

    // Preenche o formulário de edição com os dados do serviço
    document.getElementById('editServiceId').value = service.id;
    document.getElementById('editServiceType').value = service.service_type;
    document.getElementById('editServiceDate').value = service.service_date ? new Date(service.service_date).toISOString().split('T')[0] : '';
    document.getElementById('editAnimalId').value = service.animal_id;
    document.getElementById('editFarmId').value = service.farm_id;
    document.getElementById('editVeterinarianName').value = service.veterinarian_name;
    document.getElementById('editDescription').value = service.description;

    window.scrollTo(0, document.getElementById('editSection').offsetTop); // Rola até o formulário de edição
  } catch (error) {
    alert(`Erro ao carregar dados do serviço para edição: ${error.message}`);
  }
}

// Função para deletar um serviço
async function deleteService(id) {
  if (confirm('Tem certeza que deseja deletar este serviço?')) {
    try {
      const response = await fetch(`http://localhost:8080/services/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Erro ao deletar serviço.');

      alert('Serviço deletado com sucesso!');
      fetchServices(); // Atualiza a tabela após a exclusão
    } catch (error) {
      alert(`Erro ao deletar serviço: ${error.message}`);
    }
  }
}

// Manipuladores de evento dos formulários
createServiceForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(createServiceForm);

  await createService(Object.fromEntries(formData));

  createServiceForm.reset();
});

// Manipulador de evento para o formulário de edição
editServiceForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(editServiceForm);

  const data = Object.fromEntries(formData);

  await editService(data.id, data);

  editServiceForm.reset();
});

// Inicializa a página carregando os serviços cadastrados
document.addEventListener('DOMContentLoaded', () => fetchServices());
