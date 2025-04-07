// app.js

const backendUrl = "https://juroslator-2.onrender.com";
let usuarioLogado = null;

// Exibe a tela de login e esconde as outras
function showLogin() {
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("cadastroContainer").style.display = "none";
    document.getElementById("calcContainer").style.display = "none";
}

// Exibe a tela de cadastro
function showCadastro() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("cadastroContainer").style.display = "block";
    document.getElementById("calcContainer").style.display = "none";
}

// Exibe a tela principal após login
function showCalc() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("cadastroContainer").style.display = "none";
    document.getElementById("calcContainer").style.display = "block";
    carregarHistorico();
}

async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch(`${backendUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login bem-sucedido!");
            usuarioLogado = email;
            showCalc();
        } else {
            alert(data.erro || "Erro ao fazer login");
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro de rede. Tente novamente.");
    }
}

async function cadastrar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch(`${backendUrl}/cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado com sucesso! Faça login.");
            showLogin();
        } else {
            alert(data.erro || "Erro ao cadastrar");
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro de rede. Tente novamente.");
    }
}

async function calcular() {
    const principal = parseFloat(document.getElementById('principal').value);
    const taxa = parseFloat(document.getElementById('taxa').value);
    const tempo = parseFloat(document.getElementById('tempo').value);

    if (!usuarioLogado) {
        alert("Você precisa estar logado.");
        return;
    }

    const res = await fetch(`${backendUrl}/calcular`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ principal, taxa, tempo, usuario: usuarioLogado })
    });

    const data = await res.json();
    document.getElementById('resultado').innerText = `Juros: R$ ${data.juros.toFixed(2)} | Total: R$ ${data.montante_final.toFixed(2)}`;
    document.getElementById('comparacao').innerText = `Comparação com SELIC: ${data.comparacao.toFixed(2)}%`;
    carregarHistorico();
}

async function carregarHistorico() {
    const res = await fetch(`${backendUrl}/historico?usuario=${usuarioLogado}`);
    const historico = await res.json();

    const lista = document.getElementById('historico');
    lista.innerHTML = '';

    const labels = [];
    const dados = [];

    historico.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `R$ ${item.valor_inicial} em ${item.tempo} meses → R$ ${item.montante_final}`;

        const btn = document.createElement('button');
        btn.innerText = '🗑️';
        btn.onclick = () => deletarAplicacao(item.id);

        li.appendChild(btn);
        lista.appendChild(li);

        labels.push(`${item.tempo}m`);
        dados.push(item.montante_final);
    });

    renderizarGrafico(labels, dados);
}

async function deletarAplicacao(id) {
    await fetch(`${backendUrl}/apagar/${id}`, {
        method: 'DELETE'
    });
    carregarHistorico();
}

function logout() {
    usuarioLogado = null;
    showLogin();
}

function renderizarGrafico(labels, dados) {
    const ctx = document.getElementById('graficoAplicacoes').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Montante Final (R$)',
                data: dados,
                borderColor: 'blue',
                backgroundColor: 'lightblue',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Inicia mostrando a tela de login
showLogin();

