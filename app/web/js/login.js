document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8080/admins/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login falhou. Verifique suas credenciais.');
        }
        return response.json();
    })
    .then(data => {
        alert('Login bem-sucedido!');
        window.location.href = '../pages/dashboard.html'; // Redireciona para dashboard
    })
    .catch(error => {
        document.getElementById('error-message').textContent = error.message; // Exibe mensagem de erro
        console.error('Erro:', error);
    });
});
