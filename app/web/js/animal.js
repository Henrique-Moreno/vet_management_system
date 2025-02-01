const createAnimalForm = document.getElementById('createAnimalForm');
const animalsTableBody = document.querySelector('#animalsTable tbody');

// Função para criar um animal
async function createAnimal(data) {
  try {
    const response = await fetch('http://localhost:8080/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Não foi possível criar o animal.`);

    const result = await response.json();
    alert(`Animal criado com sucesso! ID: ${result.id}`);
    fetchAnimals();
    return result;
  } catch (error) {
    alert(`Erro ao criar animal: ${error.message}`);
  }
}

// Função para buscar todos os animais
async function fetchAnimals() {
  try {
    const response = await fetch('http://localhost:8080/animals');

    if (!response.ok) throw new Error('Erro ao buscar animais.');

    const animals = await response.json();

    animalsTableBody.innerHTML = '';

    animals.forEach((animal) => {
      const row = document.createElement('tr');

      row.innerHTML = `
                <td>${animal.id}</td>
                <td>${animal.name}</td>
                <td>${animal.species}</td>
                <td>${animal.breed}</td>
                <td>${animal.gender}</td>
                <td><button onclick='loadEditForm(${animal.id})'>Editar</button><button onclick='deleteAnimal(${animal.id})'>Deletar</button></td>`;

      animalsTableBody.appendChild(row);
    });
  } catch (error) {
    alert(`Erro ao buscar animais: ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("filterForm");
  const filterCriteria = document.getElementById("filterCriteria");
  const filterInputs = document.getElementById("filterInputs");
  const filterResults = document.getElementById("filterResults");

  // Atualiza os inputs dinamicamente com base no critério selecionado
  filterCriteria.addEventListener("change", function () {
    const selectedCriteria = filterCriteria.value;
    filterInputs.innerHTML = ""; // Limpa os inputs anteriores

    if (selectedCriteria === "familyTree") {
      filterInputs.innerHTML = `
        <label for="filterAnimalId">ID do Animal:</label>
        <input type="number" id="filterAnimalId" name="animal_id" required>`;
    } else if (selectedCriteria === "animalsByFarm") {
      filterInputs.innerHTML = `
        <label for="filterFarmId">ID da Fazenda:</label>
        <input type="number" id="filterFarmId" name="farm_id" required>`;
    } else if (selectedCriteria === "reproductiveHistory") {
      filterInputs.innerHTML = `
        <label for="filterAnimalId">ID do Animal:</label>
        <input type="number" id="filterAnimalId" name="animal_id" required>`;
    }
  });

  // Manipulador de evento para o formulário de filtro
  filterForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const criteria = filterCriteria.value;
    let url = "";

    if (criteria === "familyTree") {
      const animalId = document.getElementById("filterAnimalId").value;
      url = `http://localhost:8080/animals/${animalId}/family-tree`;
    } else if (criteria === "animalsByFarm") {
      const farmId = document.getElementById("filterFarmId").value;
      url = `http://localhost:8080/animals/farm/${farmId}`;
    } else if (criteria === "reproductiveHistory") {
      const animalId = document.getElementById("filterAnimalId").value;
      url = `http://localhost:8080/animals/${animalId}/reproductive-history`;
    }

    // Busca informações com a URL específica
    await fetchFilteredData(url);
  });

  // Função para buscar informações filtradas
  async function fetchFilteredData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Erro ao buscar informações.");

      const data = await response.json();

      // Exibe os resultados
      displayFilterResults(data);
    } catch (error) {
      alert(`Erro ao buscar informações: ${error.message}`);
    }
  }

  // Função para exibir os resultados
  function displayFilterResults(data) {
    filterResults.innerHTML = ""; // Limpa os resultados anteriores

    if (!data || Object.keys(data).length === 0) {
      filterResults.innerHTML = "<p>Nenhuma informação encontrada.</p>";
      return;
    }

    if (Array.isArray(data)) {
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Raça</th>
            <th>Sexo</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(animal => `
            <tr>
              <td>${animal.id}</td>
              <td>${animal.name}</td>
              <td>${animal.species}</td>
              <td>${animal.breed || 'N/A'}</td>
              <td>${animal.gender}</td>
            </tr>`).join('')}
        </tbody>`;

      filterResults.appendChild(table);
    } else if (data.father || data.mother || data.children) {
      const familyTreeDiv = document.createElement("div");
      familyTreeDiv.innerHTML = `
        <h3>Árvore Genealógica</h3>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Nome:</strong> ${data.name}</p>
        ${data.father ? `<p><strong>Pai:</strong> ${data.father.name} (ID: ${data.father.id})</p>` : ""}
        ${data.mother ? `<p><strong>Mãe:</strong> ${data.mother.name} (ID: ${data.mother.id})</p>` : ""}
        ${data.children && data.children.length > 0 ? `
          <h4>Filhos:</h4>
          <ul>${data.children.map(child => `<li>${child.name} (ID: ${child.id})</li>`).join('')}</ul>` : ""}
      `;

      filterResults.appendChild(familyTreeDiv);
    } else if (data.breeding_history || data.birth_history) {
      const reproductiveHistoryDiv = document.createElement("div");
      reproductiveHistoryDiv.innerHTML = `
        <h3>Histórico Reprodutivo</h3>
        ${data.breeding_history && data.breeding_history.length > 0 ? `
          <h4>Cruzamentos:</h4>
          <ul>${data.breeding_history.map(b => `
            <li>Data: ${new Date(b.breeding_date).toLocaleDateString()}, Macho ID: ${b.male_id}, Sucesso: ${b.success}</li>`).join('')}</ul>` : "<p>Nenhum cruzamento registrado.</p>"}
        
        ${data.birth_history && data.birth_history.length > 0 ? `
          <h4>Partos:</h4>
          <ul>${data.birth_history.map(b => `
            <li>Data: ${new Date(b.birth_date).toLocaleDateString()}, Número de Filhotes: ${b.number_of_offspring}</li>`).join('')}</ul>` : "<p>Nenhum parto registrado.</p>"}
      `;

      filterResults.appendChild(reproductiveHistoryDiv);
    }
  }
});

createAnimalForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(createAnimalForm);

  await createAnimal(Object.fromEntries(formData));

  createAnimalForm.reset();
});

editAnimalForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(editAnimalForm);

  const data = Object.fromEntries(formData);

  await editAnimal(data.id, data);

  editAnimalForm.reset();
});

// Inicializa a página carregando os animais cadastrados
document.addEventListener('DOMContentLoaded', fetchAnimals);