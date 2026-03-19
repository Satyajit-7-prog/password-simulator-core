import itertools
import string
import time

def run_brute_force(target_password, max_length=4):
    start_time = time.time()
    attempts = 0
    
    # Characters we will use to guess: a-z and 0-9
    chars = string.ascii_lowercase + string.digits 
    
    for length in range(1, max_length + 1):
        # itertools.product generates all possible combinations
        for guess_tuple in itertools.product(chars, repeat=length):
            attempts += 1
            guess = ''.join(guess_tuple)
            
            if guess == target_password:
                end_time = time.time()
                return {
                    "success": True,
                    "password": guess,
                    "attempts": attempts,
                    "time_taken": round(end_time - start_time, 4)
                }
    
    end_time = time.time()
    return {
        "success": False,
        "message": f"Could not crack within {max_length} characters.",
        "attempts": attempts,
        "time_taken": round(end_time - start_time, 4)
    }