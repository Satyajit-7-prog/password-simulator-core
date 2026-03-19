from flask import Flask, request, jsonify
from flask_cors import CORS

# IMPORTING YOUR ALGORITHMS
from dictionary_attack import run_dictionary_attack
from brute_force import run_brute_force
from strength_checker import check_password_strength
from ai_inference import predict_password_strength

# NEW: Importing the generator!
from generator import generate_secure_password

# IMPORTING DATABASE
from database import init_db, log_attack, get_all_history

app = Flask(__name__)
CORS(app) 

# Initialize the MySQL Database
init_db()

# Route 1: Dictionary Attack
@app.route('/api/dictionary-attack', methods=['POST'])
def api_dictionary_attack():
    data = request.json
    target = data.get("password", "")
    result = run_dictionary_attack(target) 
    log_attack("Dictionary Attack", target, result.get("success", False), result.get("time_taken", 0))
    return jsonify(result)

# Route 2: Brute Force Attack
@app.route('/api/brute-force', methods=['POST'])
def api_brute_force():
    data = request.json
    target = data.get("password", "")
    result = run_brute_force(target)
    log_attack("Brute Force Attack", target, result.get("success", False), result.get("time_taken", 0))
    return jsonify(result)

# Route 3: AI Strength Checker
@app.route('/api/strength', methods=['POST'])
def api_strength():
    data = request.json
    target = data.get("password", "")
    standard_result = check_password_strength(target)
    ai_result = predict_password_strength(target)
    return jsonify({
        "password": target,
        "standard_zxcvbn_score": standard_result,
        "custom_ai_prediction": ai_result
    })

# Route 4: Attack History (MySQL)
@app.route('/api/history', methods=['GET'])
def api_history():
    history_data = get_all_history()
    return jsonify(history_data)

# Route 5: Secure Password Generator (THIS WAS MISSING!)
@app.route('/api/generate', methods=['POST'])
def api_generate():
    data = request.json
    length = int(data.get("length", 16))
    use_numbers = data.get("use_numbers", True)
    use_symbols = data.get("use_symbols", True)
    
    result = generate_secure_password(length, use_numbers, use_symbols)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)