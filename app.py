from flask import Flask, request, jsonify
from flask_cors import CORS
import os 

# Inicializa a aplicação Flask
app = Flask(__name__)

# Libera acesso CORS para o front-end (ex: GitHub Pages)
CORS(app)

# Simula um "banco de dados" temporário
usuarios = {
    "teste@teste.com": "1234"
}


# Rota básica para verificar se a API está funcionando
@app.route("/")
def home():
    return "API JurosLator rodando com sucesso!"

# Rota para receber dados do front-end e retornar os cálculos
@app.route("/calcular", methods=["POST"])
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
