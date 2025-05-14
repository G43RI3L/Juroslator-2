from flask import Flask, request, jsonify
from flask_cors import CORS
import os


# Inicializa a aplicação Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Libera CORS para todas as rotas


# Simula um "banco de dados" temporário de usuários
usuarios = {
    "teste@teste.com": "1234"
}


# Rota básica para verificar se a API está online
@app.route("/")
def home():
    return "API JurosLator rodando com sucesso!"

# Rota para login de usuários
@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if email in usuarios and usuarios[email] == senha:
        return jsonify({"mensagem": "Login realizado com sucesso"})
    else:
        return jsonify({"erro": "Credenciais inválidas"}), 401


# Rota para cadastro de novos usuários

@app.route("/cadastro", methods=["POST", "OPTIONS"])
def cadastro():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"erro": "E-mail e senha são obrigatórios"}), 400

    if email in usuarios:
        return jsonify({"erro": "Usuário já cadastrado"}), 400

    usuarios[email] = senha
    return jsonify({"mensagem": "Cadastro realizado com sucesso"})


# Rota para cálculo de juros compostos
@app.route("/calcular", methods=["POST", "OPTIONS"])
def calcular():
    if request.method == "OPTIONS":
        return '', 204

    dados = request.get_json()

    try:
        capital = float(dados["capital"])
        taxa = float(dados["taxa"])
        tempo = int(dados["tempo"])

        montante = capital * ((1 + taxa / 100) ** tempo)
        juros = montante - capital
        mensal = juros / tempo if tempo > 0 else 0

        return jsonify({
            "montante": round(montante, 2),
            "juros": round(juros, 2),
            "mensal": round(mensal, 2)
        })

    except Exception as e:
        return jsonify({"erro": str(e)}), 400

# Aplica cabeçalhos CORS a todas as respostas
@app.after_request
def aplicar_cors(resposta):
    resposta.headers["Access-Control-Allow-Origin"] = "*"
    resposta.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resposta.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, DELETE"
    return resposta

# Executa o servidor localmente ou na porta definida pelo Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port, debug=True)


# Executa o servidor localmente ou na porta definida pelo Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
