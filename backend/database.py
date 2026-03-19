import mysql.connector

# --- YOUR MYSQL SETTINGS ---
# Change these if your local MySQL uses a different username/password
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "Satyajit@2006" 
DB_NAME = "password_simulator"

def get_connection(use_database=True):
    """Helper function to connect to MySQL"""
    if use_database:
        return mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    return mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)

def init_db():
    """Creates the database and table inside your MySQL Server."""
    try:
        # 1. Connect to MySQL server to create the database
        conn = get_connection(use_database=False)
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        conn.close()

        # 2. Connect directly to the new database to create the table
        conn = get_connection(use_database=True)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS attack_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                attack_type VARCHAR(255),
                target_password VARCHAR(255),
                success BOOLEAN,
                time_taken FLOAT
            )
        ''')
        conn.commit()
        conn.close()
        print("✅ MySQL Database connected and initialized successfully!")
    except mysql.connector.Error as err:
        print(f"❌ MySQL Error: {err}")
        print("Make sure your XAMPP or MySQL server is turned ON!")

def log_attack(attack_type, target_password, success, time_taken):
    """Saves a new attack result into MySQL."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO attack_history (attack_type, target_password, success, time_taken)
            VALUES (%s, %s, %s, %s)
        ''', (attack_type, target_password, success, time_taken))
        conn.commit()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Failed to log attack: {err}")

def get_all_history():
    """Fetches the 20 most recent attacks from MySQL."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM attack_history ORDER BY id DESC LIMIT 20')
        rows = cursor.fetchall()
        conn.close()
        
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "attack_type": row[1],
                "target_password": row[2],
                # MySQL sometimes returns 1/0 for booleans, so we convert it nicely
                "success": bool(row[3]), 
                "time_taken": round(row[4], 4)
            })
        return history
    except mysql.connector.Error as err:
        print(f"Failed to fetch history: {err}")
        return []