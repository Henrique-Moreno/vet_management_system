document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:8080/admins/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(handleLoginResponse)
    .then(handleLoginSuccess)
    .catch(handleLoginError);
}

function handleLoginResponse(response) {
  if (!response.ok) {
    throw new Error('Login falhou. Verifique suas credenciais.');
  }

  return response.json();
}

function handleLoginSuccess(data) {
  alert('Login bem-sucedido!');
  window.location.href = '../pages/dashboard.html';
}

function handleLoginError(error) {
  document.getElementById('error-message').textContent = error.message;
  console.error('Erro:', error);
}
