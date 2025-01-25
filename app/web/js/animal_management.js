document.addEventListener('DOMContentLoaded', function () {
  const animalsTableBody = document.getElementById('animalsBody');

  // Função para carregar os animais na tabela
  function loadAnimals(filters = {}) {
    let query = new URLSearchParams(filters).toString();
    fetch(`http://127.0.0.1:8080/animals?${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar animais');
        }
        return response.json();
      })
      .then(data => {
        animalsTableBody.innerHTML = ''; // Limpa a tabela antes de preencher
        data.forEach(animal => {
          const row = document.createElement('tr');
          row.innerHTML = `
                      <td>${animal.id}</td>
                      <td>${animal.name}</td>
                      <td>${animal.species || 'N/A'}</td>
                      <td>${animal.breed || 'N/A'}</td>
                      <td>${animal.gender || 'N/A'}</td>
                      <td>${animal.birthDate || 'N/A'}</td>
                      <td>${animal.weight || 'N/A'}</td>
                      <td>
                          <button onclick="editAnimal(${animal.id})">Editar</button> 
                          <button onclick="deleteAnimal(${animal.id})">Excluir</button>
                      </td>`;
          animalsTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Erro ao carregar animais:', error));
  }

  // Função para abrir o modal
  function openModal() {
    document.getElementById('animalModal').style.display = 'block';
  }

  // Função para fechar o modal
  function closeModal() {
    document.getElementById('animalModal').style.display = 'none';
  }

  // Evento para adicionar um novo animal
  document.getElementById('addAnimalBtn').addEventListener('click', function () {
    openModal(); // Abre o modal para adicionar um novo animal
    document.getElementById('modalTitle').innerText = 'Adicionar Animal';
    document.getElementById('animalForm').reset(); // Limpa o formulário
    document.getElementById('animalId').value = ''; // Limpa o ID
  });

  // Evento para filtrar os animais com base nos inputs
  document.getElementById('filterBtn').addEventListener('click', function () {
    const nameFilter = document.getElementById('nameFilter').value.trim();
    const speciesFilter = document.getElementById('speciesFilter').value.trim();
    const breedFilter = document.getElementById('breedFilter').value.trim();

    const filters = {};
    if (nameFilter) filters.name = nameFilter;
    if (speciesFilter) filters.species = speciesFilter;
    if (breedFilter) filters.breed = breedFilter;

    loadAnimals(filters); // Carrega os animais com os filtros aplicados
  });

// Função para criar um novo animal
function createAnimal(animalData) {
  return fetch(`http://127.0.0.1:8080/animals`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Garante que estamos aceitando JSON na resposta
      },
      body: JSON.stringify(animalData),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`Erro ao criar o animal: ${response.statusText}`);
          }
          return response.json();
      });
}


  // Evento para salvar o animal (adicionar ou editar)
  document.getElementById('animalForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const animalId = document.getElementById('animalId').value;

    const animalData = {
      name: document.getElementById('animalName').value.trim(),
      species: document.getElementById('species').value.trim(),
      breed: document.getElementById('breed').value.trim(),
      gender: document.getElementById('gender').value,
      birthDate: document.getElementById('birthDate').value,
      weight: parseFloat(document.getElementById('weight').value),
      farm_id: parseInt(document.getElementById('farmId').value)
    };

    if (!animalData.name) {
      alert("O campo 'Nome' é obrigatório.");
      return;
    }

    if (animalId) { // Se um ID existir, atualiza o animal existente
      fetch(`http://127.0.0.1:8080/animals/${animalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Animal atualizado com sucesso!');
          loadAnimals(); // Recarrega os animais na tabela
          closeModal(); // Fecha o modal após salvar
        })
        .catch(error => console.error('Erro ao atualizar o animal:', error));
    } else { // Caso contrário, cria um novo animal
      createAnimal(animalData)
        .then(data => {
          alert(data.message || 'Animal criado com sucesso!');
          loadAnimals(); // Recarrega os animais na tabela
          closeModal(); // Fecha o modal após salvar
        })
        .catch(error => console.error('Erro ao criar o animal:', error));
    }
  });

  // Função para editar um animal existente
  window.editAnimal = function (animalId) {
    fetch(`http://127.0.0.1:8080/animals/${animalId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        openModal(); // Abre o modal para edição
        document.getElementById('modalTitle').innerText = 'Editar Animal';
        document.getElementById('animalName').value = data.name;
        document.getElementById('species').value = data.species || '';
        document.getElementById('breed').value = data.breed || '';
        document.getElementById('gender').value = data.gender || '';
        document.getElementById('birthDate').value = data.birthDate || '';
        document.getElementById('weight').value = data.weight || '';
        document.getElementById('farmId').value = data.farm_id || ''; // Define o ID da fazenda no campo oculto
        document.getElementById('animalId').value = animalId; // Define o ID no campo oculto
      })
      .catch(error => console.error('Erro ao buscar o animal:', error));
  };

  // Função para excluir um animal existente
  window.deleteAnimal = function (animalId) {
    if (confirm("Você tem certeza que deseja excluir este animal?")) {
      fetch(`http://127.0.0.1:8080/animals/${animalId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Animal excluído com sucesso!');
          loadAnimals(); // Recarrega os animais na tabela após exclusão
        })
        .catch(error => console.error('Erro ao excluir o animal:', error));
    }
  };

  loadAnimals(); // Carrega os animais na tabela ao iniciar a página

});
