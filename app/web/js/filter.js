document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("filterForm");
  const filterCriteria = document.getElementById("filterCriteria");
  const filterInputs = document.getElementById("filterInputs");
  const filterResults = document.getElementById("filterResults");

  // Atualiza os inputs dinamicamente com base no critério selecionado
  filterCriteria.addEventListener("change", function () {
    const selectedCriteria = filterCriteria.value;
    filterInputs.innerHTML = ""; // Limpa os inputs anteriores

    if (selectedCriteria === "animal") {
      filterInputs.innerHTML = `
        <label for="filterAnimalId">ID do Animal:</label>
        <input type="number" id="filterAnimalId" name="animal_id" required>`;
    } else if (selectedCriteria === "farm") {
      filterInputs.innerHTML = `
        <label for="filterFarmId">ID da Fazenda:</label>
        <input type="number" id="filterFarmId" name="farm_id" required>`;
    } else if (selectedCriteria === "dateRange") {
      filterInputs.innerHTML = `
        <label for="filterStartDate">Data Inicial:</label>
        <input type="date" id="filterStartDate" name="start_date" required>

        <label for="filterEndDate">Data Final:</label>
        <input type="date" id="filterEndDate" name="end_date" required>`;
    }
  });

  // Manipulador de evento para o formulário de filtro
  filterForm.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const criteria = filterCriteria.value;
    let url = "";

    if (criteria === "animal") {
      const animalId = document.getElementById("filterAnimalId").value;
      url = `http://localhost:8080/services/animal/${animalId}`;
    } else if (criteria === "farm") {
      const farmId = document.getElementById("filterFarmId").value;
      url = `http://localhost:8080/services/farm/${farmId}`;
    } else if (criteria === "dateRange") {
      const startDate = document.getElementById("filterStartDate").value;
      const endDate = document.getElementById("filterEndDate").value;

      if (new Date(startDate) > new Date(endDate)) {
        alert("A data inicial não pode ser maior que a data final.");
        return;
      }

      url = `http://localhost:8080/services/date-range?start=${startDate}&end=${endDate}`;
    }

    // Busca serviços com a URL específica
    await fetchFilteredServices(url);
  });

  // Função para buscar serviços filtrados
  async function fetchFilteredServices(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Erro ao buscar serviços.");

      const services = await response.json();

      // Exibe os resultados no HTML
      displayFilterResults(services);
    } catch (error) {
      alert(`Erro ao buscar serviços: ${error.message}`);
    }
  }

  // Função para exibir os resultados no HTML
  function displayFilterResults(services) {
    filterResults.innerHTML = ""; // Limpa os resultados anteriores

    if (services.length === 0) {
      filterResults.innerHTML = "<p>Nenhum serviço encontrado.</p>";
      return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Tipo de Serviço</th>
          <th>Data do Serviço</th>
          <th>Veterinário</th>
        </tr>
      </thead>
      <tbody>
        ${services.map(service => `
          <tr>
            <td>${service.id}</td>
            <td>${service.service_type}</td>
            <td>${new Date(service.service_date).toLocaleDateString()}</td>
            <td>${service.veterinarian_name}</td>
          </tr>`).join('')}
      </tbody>`;
    
   filterResults.appendChild(table);
  }
});



