// A reusable function to talk to our Python backend
async function sendToBackend(endpoint, passwordInputId, resultBoxId) {
    // 1. Grab the password from the screen
    const password = document.getElementById(passwordInputId).value;
    const resultBox = document.getElementById(resultBoxId);
    
    resultBox.innerHTML = "Processing... ⏳"; // Show loading text

    try {
        // 2. Send the password to Flask via fetch API
        const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });

        // 3. Wait for the Python server to reply
        const data = await response.json();
        
        // 4. Print the result beautifully on the screen
        resultBox.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(data, null, 2)}</pre>`;
        
    } catch (error) {
        resultBox.innerHTML = "❌ Error: Make sure your Python server is running!";
    }
}

// These functions are connected to the buttons in your HTML
function runDictionaryAttack() {
    sendToBackend('dictionary-attack', 'dictInput', 'dictResult');
}

function runBruteForce() {
    sendToBackend('brute-force', 'bruteInput', 'bruteResult');
}

function checkStrength() {
    sendToBackend('strength', 'strengthInput', 'strengthResult');
}
// NEW: Fetch and display MySQL database history
async function loadHistory() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return; // Only run this if we are on the history page

    try {
        const response = await fetch('http://127.0.0.1:5000/api/history');
        const historyData = await response.json();
        
        tableBody.innerHTML = ''; // Clear the loading text
        
        if (historyData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No attacks recorded yet. Go run an attack!</td></tr>';
            return;
        }

        // Loop through the MySQL rows and create HTML for each one
        historyData.forEach(row => {
            const statusClass = row.success ? 'success-true' : 'success-false';
            const statusText = row.success ? 'CRACKED' : 'FAILED';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.attack_type}</td>
                <td>${row.target_password}</td>
                <td class="${statusClass}">${statusText}</td>
                <td>${row.time_taken}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#ff003c;">Error loading database! Is your Python server running?</td></tr>';
    }
}

// Automatically load the database when the history page is opened
window.onload = loadHistory;
// NEW: Ask Python to generate a secure password
async function generatePassword() {
    const length = document.getElementById('genLength').value;
    const useNumbers = document.getElementById('genNumbers').checked;
    const useSymbols = document.getElementById('genSymbols').checked;
    const resultBox = document.getElementById('genResult');
    
    resultBox.innerHTML = "<pre style='color: #00ffcc;'>Generating secure key... ⏳</pre>";
    
    try {
        const response = await fetch('http://127.0.0.1:5000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                length: parseInt(length), 
                use_numbers: useNumbers, 
                use_symbols: useSymbols 
            })
        });
        
        const data = await response.json();
        
        // Print the new password beautifully in the center of the terminal box
        resultBox.innerHTML = `<pre style="font-size: 20px; text-align: center; color: #00ffcc; font-weight: bold; letter-spacing: 2px;">${data.secure_password}</pre>`;
        
    } catch (error) {
        resultBox.innerHTML = "<pre style='color: #ff003c;'>❌ Error: Make sure your Python server is running!</pre>";
    }
}