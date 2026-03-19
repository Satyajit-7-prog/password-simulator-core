# 🔐 Password Simulator Core
> Educational Cybersecurity & AI Analysis Engine

## 📖 Project Overview
The Password Simulator Core is a full-stack educational web application designed to demonstrate the fragility of human-generated passwords and the necessity of cryptographic security. It allows users to visually experience offensive cyber-attacks and defensive AI-driven security measures in a safe, controlled environment.

---

## ✨ Core Modules

### 1. 🗡️ Attack Simulator
Test passwords against offensive algorithms to understand time complexity and human predictability.
* **Dictionary Attack:** Simulates rapid, wordlist-based attacks by cross-referencing targets against a local `common_passwords.txt` database.
* **Brute Force Attack:** Systematically iterates through character combinations to crack targets, featuring a deliberate hardware-safety circuit breaker (Max 4 characters).

### 2. 🧠 AI Strength Analyzer
Evaluates password entropy and structural strength using a custom Machine Learning model, moving beyond basic regex rules to understand true cryptographic resilience.

### 3. 🗄️ Attack Database
A live MySQL integration that logs all attempted attacks, targets, success rates, and time-taken metrics for historical analysis and review.

### 4. 🛡️ Secure Generator
Creates military-grade, cryptographically secure passwords engineered to be completely resistant to both Dictionary and rapid Brute Force methodologies.

---

## 🏗️ System Architecture & Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Python 3, Flask Web Framework
* **Database:** MySQL
* **Machine Learning:** Scikit-Learn / Pandas

---

## 🚀 Installation & Local Setup

### 1. Extract the Project
Ensure all project files (frontend UI and backend Python scripts) are extracted to a single folder on your machine.

### 2. Install Dependencies
Open your terminal or command prompt in the project folder and install the required Python libraries:
```bash
pip install flask mysql-connector-python pandas scikit-learn