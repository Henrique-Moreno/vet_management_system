from app import create_app

# Cria uma instância da aplicação 
app = create_app()

if __name__ == "__main__":
    # Executa a aplicação em modo de debug na porta 8080
    app.run(host='127.0.0.1', port=8080, debug=True)
