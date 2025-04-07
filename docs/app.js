// app.js

let usuarioLogado = null;
const apiUrl = "https://juroslator-2.onrender.com";

fetch(`${apiUrl}/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, senha }),
})
 // ✅ URL correta do Render

function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('cadastroContainer').style.display = 'none';
    document.getElementById('calcContainer').style.display = 'none';
}

function showCadastro() {
    document.getElementById('cadastroContainer').style.display = 'block';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('calcContainer').style.display = 'none';
}

function showCalc() {
    document.getElementById('calcContainer').style.display = 'block';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('cadastroContainer').style.display = 'none';
    carregarHistorico();
}

async function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const res = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    if (res.ok) {
        usuarioLogado = username;
        showCalc();
    } else {
        alert('Falha ao fazer login.');
    }
}

async function cadastrar() {
    const username = document.getElementById('cadastroUser').value;
    const password = document.getElementById('cadastroPass').value;

    const res = await fetch(`${backendUrl}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    if (res.ok) {
        alert('Usuário cadastrado! Faça login.');
        showLogin();
    } else {
        alert('Erro ao cadastrar.');
    }
}

function logout() {
    usuarioLogado = null;
    showLogin();
}

async function calcular() {
    const principal = parseFloat(document.getElementById('principal').value);
    const taxa = parseFloat(document.getElementById('taxa').value);
    const tempo = parseFloat(document.getElementById('tempo').value);

    const res = await fetch(`${backendUrl}/calcular`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({principal, taxa, tempo, usuario: usuarioLogado})
    });

    const data = await res.json();
    document.getElementById('resultado').innerText = `Juros: R$ ${data.juros.toFixed(2)} | Total: R$ ${data.montante_final.toFixed(2)}`;
    document.getElementById('comparacao').innerText = `Desempenho comparado à SELIC: ${data.comparacao.toFixed(2)}%`;

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

showLogin(); // Inicia com a tela de login
