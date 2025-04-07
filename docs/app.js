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
const backendUrl = "https://juroslator-2.onrender.com"; // substitua pela URL real da sua API

async function login() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    const email = emailInput.value;
    const senha = senhaInput.value;

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
            window.location.href = "home.html"; // ou outra página após login
        } else {
            alert(data.erro || "Erro ao fazer login");
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro de rede. Tente novamente.");
    }
}

async function cadastrar() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    const email = emailInput.value;
    const senha = senhaInput.value;

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
            alert("Cadastro realizado com sucesso!");
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
