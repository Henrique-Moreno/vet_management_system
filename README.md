<h1>Documentação do Sistema ERP para Gestão Veterinária</h1>

<p>Esta é a documentação completa, com um guia passo a passo para configurar e executar a aplicação. O guia abrange desde a instalação das dependências necessárias até a execução da aplicação em modo de desenvolvimento.</p>

<h2>Sumário</h2>
<ul>
    <li><a href="#tecnologias-utilizadas">Tecnologias Utilizadas</a></li>
    <li><a href="#requisitos">Requisitos</a></li>
    <li><a href="#configuração-do-ambiente">Configuração do Ambiente</a></li>
    <li><a href="#como-rodar-a-aplicação-localmente">Como Rodar a Aplicação Localmente</a></li>
    <li><a href="#testando-a-aplicação">Testando a Aplicação</a></li>
    <li><a href="#backup-de-dados">Backup de Dados</a></li>
</ul>

<h2 id="tecnologias-utilizadas">Tecnologias Utilizadas</h2>
<ul>
    <li>Python</li>
    <li>Flask</li>
    <li>SQLAlchemy</li>
    <li>MySQL</li>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>

<h2 id="requisitos">Requisitos</h2>
<p>Antes de rodar a aplicação, você vai precisar ter instalado:</p>
<ul>
    <li><strong>Python 3.8 ou superior</strong> (recomendado)</li>
    <li><strong>MySQL</strong> (servidor MySQL instalado e em execução)</li>
    <li><strong>Git</strong> (opcional, para clonar o repositório)</li>
</ul>

<h2 id="configuração-do-ambiente">Configuração do Ambiente</h2>
<p>Para configurar o ambiente de desenvolvimento, siga os passos abaixo:</p>

<ol>
    <li><strong>Configuração do MySQL</strong>:
        <ul>
            <li>Certifique-se de que o servidor MySQL está instalado e em execução.</li>
            <li>Crie um usuário com permissões para criar bancos de dados e tabelas (ou use o usuário <code>root</code>).</li>
            <li>Não é necessário criar o banco de dados manualmente; ele será criado automaticamente pelo SQLAlchemy.</li>
        </ul>
    </li>
    <li><strong>Configuração do arquivo <code>.env</code></strong>:
        <ul>
            <li>No projeto, há um arquivo <code>.env.example</code>. Renomeie-o para <code>.env</code> e edite as variáveis de ambiente conforme necessário:</li>
            <pre><code>DATABASE_URL=mysql+pymysql://root:suaSenha@localhost/vet_management
SECRET_KEY=sua_chave_secreta_aqui</code></pre>
            <li>Substitua <code>suaSenha</code> pela senha do seu usuário MySQL e <code>sua_chave_secreta_aqui</code> por uma chave secreta segura.</li>
        </ul>
    </li>
</ol>

<h2 id="como-rodar-a-aplicação-localmente">Como Rodar a Aplicação Localmente</h2>
<ol>
    <li><strong>Clone este repositório ou faça download</strong>:
        <pre><code>https://github.com/vet_management_system</code></pre>
    </li>
    <li><strong>Instale as dependências</strong>:
        <pre><code>pip install -r requirements.txt</code></pre>
    </li>
    <li><strong>Configure o banco de dados</strong>:
        <ol type="a">
            <li>Inicialize o Flask-Migrate:
                <pre><code>flask db init</code></pre>
            </li>
            <li>Crie a migration inicial:
                <pre><code>flask db migrate -m "Initial migration."</code></pre>
            </li>
            <li>Aplique as migrations para criar as tabelas no banco de dados:
                <pre><code>flask db upgrade</code></pre>
            </li>
        </ol>
    </li>
    <li><strong>Popule o banco de dados com dados iniciais</strong>:
        <pre><code>python -m app.scripts.populate_db</code></pre>
        <p>Um usuário padrão será criado com as seguintes credenciais:</p>
        <ul>
            <li><strong>Usuário:</strong> <code>userAdmin</code></li>
            <li><strong>Senha:</strong> <code>12345</code></li>
        </ul>
    </li>
    <li><strong>Execute a aplicação</strong>:
        <pre><code>python app.py</code></pre>
    </li>
    <li><strong>Visualize a aplicação no navegador</strong>:
        <ul>
            <li>No VSCode, instale a extensão <strong>Go Live</strong>.</li>
            <li>Navegue até a pasta <code>app/web/pages</code> e abra o arquivo <code>login.html</code>.</li>
            <li>Clique no botão <strong>Go Live</strong> no canto inferior direito do VSCode para iniciar um servidor de desenvolvimento.</li>
            <li>Acesse a página de login no navegador e use as credenciais fornecidas acima.</li>
            <li>Após o login, você será redirecionado para o <strong>dashboard</strong>, onde poderá testar a aplicação como um todo.</li>
        </ul>
    </li>
</ol>

<h2 id="testando-a-aplicação">Testando a Aplicação</h2>
<p>Para executar os testes unitários, utilize o seguinte comando no terminal:</p>
<pre><code>pytest --tb=short --disable-warnings tests/</code></pre>

<h2 id="backup-de-dados">Backup de Dados</h2>
<p>Se você deseja exportar os dados do banco de dados para um arquivo CSV, execute o seguinte comando no terminal:</p>
<pre><code>python -m app.scripts.backup</code></pre>
<p>Isso criará um arquivo CSV com os dados atuais do banco de dados.</p>