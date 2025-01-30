document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});

function handleLogout() {
  fetch("http://localhost:8080/admins/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleLogoutResponse)
    .catch(handleError);
}

function handleLogoutResponse(response) {
  if (response.ok) {
    window.location.href = "../pages/login.html";
  } else {
    alert("Erro ao deslogar. Tente novamente.");
  }
}

function handleError(error) {
  console.error("Erro:", error);
  alert("Erro ao se conectar ao servidor.");
}
