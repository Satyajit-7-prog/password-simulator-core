from zxcvbn import zxcvbn

def check_password_strength(password):
    if not password:
        return {"score": 0, "feedback": "Please enter a password."}
        
    results = zxcvbn(password)
    
    # zxcvbn returns a score from 0 (terrible) to 4 (great)
    score_labels = {
        0: "Very Weak",
        1: "Weak",
        2: "Fair",
        3: "Strong",
        4: "Very Strong"
    }
    
    return {
        "score": results['score'],
        "label": score_labels[results['score']],
        "crack_time_estimate": results['crack_times_display']['offline_fast_hashing_1e10_per_second'],
        "feedback": results['feedback']['warning'] if results['feedback']['warning'] else "Good password!"
    }