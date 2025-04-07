const backendUrl = "https://juroslator-2.onrender.com"; // URL da sua API no Render
// Se o usuário estiver logado, redireciona automaticamente para a home
if (window.location.pathname.includes("index.html") && localStorage.getItem("logado") === "true") {
    window.location.href = "home.html";
}

// Função de login
async function login() {
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    // Se o usuário estiver logado, redireciona automaticamente para a home
    if (resposta.ok) {
        const dados = await resposta.json();
        console.log("Login realizado com sucesso:", dados);

    // Salva no localStorage que o usuário está logado
        localStorage.setItem("logado", "true");

    // Redireciona para a tela de cálculos
        window.location.href = "home.html";
    }



    if (!email || !senha) {
        alert("Preencha e-mail e senha");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login realizado com sucesso!");
            localStorage.setItem("usuario", email);
            window.location.href = "home.html"; // Garante redirecionamento
        } else {
            alert(data.erro || "Erro ao fazer login");
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro de rede ao tentar login");
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


// Inicia mostrando a tela de login
//showLogin();

