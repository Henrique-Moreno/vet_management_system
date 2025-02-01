const editAnimalForm = document.getElementById('editAnimalForm');

// Função para carregar os dados do animal no formulário de edição
async function loadEditForm(id) {
  try {
    const response = await fetch(`http://localhost:8080/animals/${id}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do animal.');
    }

    const animal = await response.json();

    // Preenche os campos do formulário
    document.getElementById('editAnimalId').value = animal.id;
    document.getElementById('editName').value = animal.name;
    document.getElementById('editSpecies').value = animal.species;
    document.getElementById('editBreed').value = animal.breed || '';
    document.getElementById('editGender').value = animal.gender;
    document.getElementById('editBirthDate').value = animal.birth_date ? new Date(animal.birth_date).toISOString().split('T')[0] : '';
    document.getElementById('editWeight').value = animal.weight || '';
    document.getElementById('editFarmId').value = animal.farm_id || '';
    document.getElementById('editHealthHistory').value = animal.health_history || '';
    document.getElementById('editFatherId').value = animal.father_id || '';
    document.getElementById('editMotherId').value = animal.mother_id || '';
    document.getElementById('editPregnancyStatus').value = animal.pregnancy_status ? 'true' : 'false';

    // Preenche o histórico de cruzamentos
    const breedingHistoryContainer = document.getElementById('breedingHistoryContainer');
    breedingHistoryContainer.innerHTML = ''; // Limpa entradas anteriores
    if (animal.breeding_history) {
      animal.breeding_history.forEach(entry => {
        addBreedingEntry(entry);
      });
    }

    // Preenche o histórico de partos
    const birthHistoryContainer = document.getElementById('birthHistoryContainer');
    birthHistoryContainer.innerHTML = ''; // Limpa entradas anteriores
    if (animal.birth_history) {
      animal.birth_history.forEach(entry => {
        addBirthEntry(entry);
      });
    }

    console.log('Dados do animal carregados com sucesso:', animal);
  } catch (error) {
    console.error('Erro ao carregar dados do animal:', error);
    alert(`Erro ao carregar dados do animal para edição: ${error.message}`);
  }
}

// Função para adicionar uma entrada de cruzamento
function addBreedingEntry(data = {}) {
  const container = document.getElementById('breedingHistoryContainer');

  const entryDiv = document.createElement('div');
  entryDiv.className = 'breeding-entry';

  entryDiv.innerHTML = `
    <label>Data do Cruzamento:</label>
    <input type="date" class="breedingDate" value="${data.breeding_date || ''}" required>

    <label>ID do Macho:</label>
    <input type="number" class="maleId" value="${data.male_id || ''}" required>

    <label>Sucesso:</label>
    <select class="success">
      <option value="true" ${data.success ? 'selected' : ''}>Sim</option>
      <option value="false" ${!data.success ? 'selected' : ''}>Não</option>
    </select>

    <button type="button" onclick="removeEntry(this)">Remover</button>
  `;

  container.appendChild(entryDiv);
}

// Função para adicionar uma entrada de parto
function addBirthEntry(data = {}) {
  const container = document.getElementById('birthHistoryContainer');

  const entryDiv = document.createElement('div');
  entryDiv.className = 'birth-entry';

  entryDiv.innerHTML = `
    <label>Data do Parto:</label>
    <input type="date" class="birthDate" value="${data.birth_date || ''}" required>

    <label>Número de Filhotes:</label>
    <input type="number" class="numberOfOffspring" value="${data.number_of_offspring || ''}" required>

    <button type="button" onclick="removeEntry(this)">Remover</button>
  `;

  container.appendChild(entryDiv);
}

// Função para remover uma entrada
function removeEntry(button) {
  button.parentElement.remove();
}

// Função para editar um animal
async function editAnimal(id, data) {
  try {
    const response = await fetch(`http://localhost:8080/animals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Tenta capturar o erro do servidor
      throw new Error(`Erro ${response.status}: ${errorData.message || 'Não foi possível editar o animal.'}`);
    }

    alert('Animal editado com sucesso!');
    fetchAnimals(); // Atualiza a lista de animais ou redireciona
  } catch (error) {
    console.log('Dados enviados:', JSON.stringify(data, null, 2));
  }
}

// Manipulador de evento para salvar alterações
editAnimalForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(this);

  // Coleta os dados dos cruzamentos
  const breedingHistory = [];
  document.querySelectorAll('.breeding-entry').forEach(entry => {
    const breedingDate = entry.querySelector('.breedingDate').value;
    const maleId = entry.querySelector('.maleId').value;

    if (breedingDate && maleId) {
      breedingHistory.push({
        breeding_date: breedingDate,
        male_id: parseInt(maleId),
        success: entry.querySelector('.success').value === 'true'
      });
    }
  });

  // Coleta os dados dos partos
  const birthHistory = [];
  document.querySelectorAll('.birth-entry').forEach(entry => {
    const birthDate = entry.querySelector('.birthDate').value;
    const numberOfOffspring = entry.querySelector('.numberOfOffspring').value;

    if (birthDate && numberOfOffspring) {
      birthHistory.push({
        birth_date: birthDate,
        number_of_offspring: parseInt(numberOfOffspring)
      });
    }
  });

  // Monta o objeto de dados
  const data = {
    id: parseInt(formData.get('id')),
    name: formData.get('name'),
    species: formData.get('species'),
    breed: formData.get('breed') || undefined,
    gender: formData.get('gender'),
    birth_date: formData.get('birth_date') || undefined,
    weight: parseFloat(formData.get('weight')) || undefined,
    farm_id: parseInt(formData.get('farm_id')) || undefined,
    health_history: formData.get('health_history') || undefined,
    father_id: parseInt(formData.get('father_id')) || undefined,
    mother_id: parseInt(formData.get('mother_id')) || undefined,
    pregnancy_status: formData.get('pregnancy_status') === 'true',
    breeding_history: breedingHistory.length > 0 ? breedingHistory : undefined,
    birth_history: birthHistory.length > 0 ? birthHistory : undefined
  };

  console.log('Dados enviados:', JSON.stringify(data, null, 2));

  try {
    await editAnimal(data.id, data);
  } catch (error) {
    console.error('Erro ao editar animal:', error);
    alert(`Erro ao editar animal: ${error.message}`);
  }
});