//const backendUrl = "https://juroslator-2.onrender.com"; // URL da sua API no Render
// Se o usuário estiver logado, redireciona automaticamente para a home// app.js atualizado para cálculo com exibição de juros mensais

let usuarioLogado = null;
const backendUrl = "https://juroslator-2.onrender.com";

// Função de login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    alert("Por favor, preencha email e senha.");
    return;
  }

  try {
    const resposta = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem("usuarioLogado", email);
      window.location.href = "home.html";
    } else {
      alert(dados.erro || "Erro ao fazer login");
    }
  } catch (error) {
    alert("Erro de rede ao tentar fazer login.");
    console.error(error);
  }
}

// Função de cadastro
async function cadastrar() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    alert("Por favor, preencha email e senha.");
    return;
  }

  try {
    const resposta = await fetch(`${backendUrl}/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert("Cadastro realizado com sucesso!");
    } else {
      alert(dados.erro || "Erro ao cadastrar");
    }
  } catch (error) {
    alert("Erro de rede ao tentar cadastrar.");
    console.error(error);
  }
}

// Função de cálculo
async function calcular() {
  const capital = parseFloat(document.getElementById("capital").value);
  const taxa = parseFloat(document.getElementById("taxa").value);
  const tempo = parseInt(document.getElementById("tempo").value);

  if (isNaN(capital) || isNaN(taxa) || isNaN(tempo)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  try {
    const resposta = await fetch(`${backendUrl}/calcular`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ capital, taxa, tempo })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      document.getElementById("resultado").innerHTML = `
        <p><strong>Montante Final:</strong> R$ ${dados.montante}</p>
        <p><strong>Juros:</strong> R$ ${dados.juros}</p>
        <p><strong>Mensalmente:</strong> R$ ${dados.mensal}</p>
      `;
    } else {
      alert("Erro: " + (dados.erro || "não foi possível calcular"));
    }
  } catch (erro) {
    alert("Erro ao conectar com a API: " + erro.message);
  }
}

// Função de logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}
