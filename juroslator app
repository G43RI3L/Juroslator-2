<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JurosLator - Login</title>
  <script defer src="/static/app.js"></script>
  <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
  <!-- Tela de Login/Cadastro -->
  <div id="auth-section">
    <h2>Login / Cadastro</h2>
    <input type="text" id="username" placeholder="Usuário" />
    <input type="password" id="password" placeholder="Senha" />
    <button onclick="login()">Entrar</button>
    <button onclick="register()">Cadastrar</button>
    <p id="auth-error"></p>
  </div>

  <!-- Tela de Cálculo e Histórico (exibida após login) -->
  <div id="main-section" style="display: none;">
    <h2>Simulação Financeira</h2>
    <label>Valor inicial:</label>
    <input type="number" id="principal"><br>
    <label>Taxa de juros (%):</label>
    <input type="number" id="taxa"><br>
    <label>Tempo (meses):</label>
    <input type="number" id="tempo"><br>
    <button onclick="calcular()">Calcular</button>
    <button onclick="logout()">Sair</button>

    <div>
      <h3>Resultado</h3>
      <p id="resultado"></p>
      <p id="comparacao"></p>
    </div>

    <div>
      <h3>Histórico de Aplicações</h3>
      <ul id="historico"></ul>
    </div>

    <div>
      <h3>Gráfico Comparativo</h3>
      <canvas id="grafico" width="400" height="200"></canvas>
    </div>
  </div>
</body>
</html>
