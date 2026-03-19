import time
import os

def run_dictionary_attack(target_password):
    start_time = time.time()
    attempts = 0
    
    # This finds your common_passwords.txt file automatically
    file_path = os.path.join(os.path.dirname(__file__), '..', 'ai_training', 'dataset', 'common_passwords.txt')
    
    try:
        with open(file_path, 'r') as file:
            for line in file:
                attempts += 1
                word = line.strip() # Removes extra spaces/newlines
                
                if word == target_password:
                    end_time = time.time()
                    return {
                        "success": True, 
                        "password": word, 
                        "attempts": attempts, 
                        "time_taken": round(end_time - start_time, 4)
                    }
                    
    except FileNotFoundError:
        return {"error": "Dataset file not found!"}

    end_time = time.time()
    return {
        "success": False, 
        "attempts": attempts, 
        "time_taken": round(end_time - start_time, 4)
    }