const backendUrl = "https://juroslator-2.onrender.com"; // URL da sua API no Render
// Se o usuário estiver logado, redireciona automaticamente para a home
if (window.location.pathname.includes("index.html") && localStorage.getItem("logado") === "true") {
    window.location.href = "home.html";
}

// Função de login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    alert("Por favor, preencha email e senha.");
    return;
  }

  try {
    const resposta = await fetch("https://juroslator-2.onrender.com/login", {
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

function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
}

// Função de cadastro
async function cadastrar() {
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;

    if (!email || !senha) {
        alert("Preencha e-mail e senha");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            // Redirecionar ou exibir próxima tela se desejar
        } else {
            alert(data.erro || "Erro ao cadastrar");
        }

    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro de rede ao tentar cadastro");
    }
    
}
async function calcular() {
  const capital = parseFloat(document.getElementById("capital").value);
  const taxa = parseFloat(document.getElementById("taxa").value);
  const tempo = parseInt(document.getElementById("tempo").value);

  if (isNaN(capital) || isNaN(taxa) || isNaN(tempo)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  try {
    const resposta = await fetch("https://juroslator-2.onrender.com/calcular", {
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
      `;
    } else {
      alert("Erro: " + (dados.erro || "não foi possível calcular"));
    }
  } catch (erro) {
    alert("Erro ao conectar com a API: " + erro.message);
  }
}


// Inicia mostrando a tela de login
//showLogin();

