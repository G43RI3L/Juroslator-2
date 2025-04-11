from flask import Flask, request, jsonify
from flask_cors import CORS
import os 

# Inicializa a aplicação Flask
app = Flask(__name__)

# Libera acesso CORS para o front-end (ex: GitHub Pages)
CORS(app, resources={r"/*": {"origins": "*"}})

# Simula um "banco de dados" temporário
usuarios = {
    "teste@teste.com": "1234"
}


# Rota básica para verificar se a API está funcionando
@app.route("/")
def home():
    return "API JurosLator rodando com sucesso!"

@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        # Resposta para preflight
        return _build_cors_preflight_response()
    
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if email in usuarios and usuarios[email] == senha:
        return _corsify_actual_response(jsonify({"mensagem": "Login realizado com sucesso"}))
    else:
        return _corsify_actual_response(jsonify({"erro": "Credenciais inválidas"})), 401

@app.route("/cadastro", methods=["POST", "OPTIONS"])
def cadastro():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return _corsify_actual_response(jsonify({"erro": "E-mail e senha são obrigatórios"})), 400

    if email in usuarios:
        return _corsify_actual_response(jsonify({"erro": "Usuário já cadastrado"})), 400

    usuarios[email] = senha
    return _corsify_actual_response(jsonify({"mensagem": "Cadastro realizado com sucesso"}))


# Funções auxiliares para tratar CORS manualmente no preflight
def _build_cors_preflight_response():
    response = jsonify({'message': 'CORS preflight'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)

# Rota para receber dados do front-end e retornar os cálculos
@app.route("/calcular", methods=["POST","OPTIONS"])
def calcular():
    dados = request.get_json()

    try:
        # Extrai os dados enviados pelo front-end
        capital = float(dados["capital"])
        taxa = float(dados["taxa"])
        tempo = int(dados["tempo"])

        # Cálculo de juros compostos
        montante = capital * ((1 + taxa / 100) ** tempo)
        juros = montante - capital

        # Retorna os resultados
        return jsonify({
            "montante": round(montante, 2),
            "juros": round(juros, 2)
        })

    except Exception as e:
        return jsonify({"erro": str(e)}), 400

# Roda a aplicação localmente (útil para testes locais)
if __name__ == "__main__":
    app.run(debug=True)
