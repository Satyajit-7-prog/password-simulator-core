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
        
        // CHECK 1: Are we running an attack?
        if (endpoint === 'dictionary-attack' || endpoint === 'brute-force') {
            
            let timeTaken = data.time || data.time_taken || "0.00";
            
            if (data.success === true || data.success === "True" || data.success === "true") {
                // SUCCESS STATE (Green Box)
                resultBox.innerHTML = `
                    <div style="border: 1px solid #00ff00; padding: 15px; border-radius: 5px; margin-top: 15px; background: rgba(0, 255, 0, 0.05);">
                        <h3 style="color: #00ff00; margin-top: 0; margin-bottom: 10px;">🔓 Password Cracked!</h3>
                        <p style="color: #e0e0e0; margin: 5px 0;"><strong>Target:</strong> ${data.password || password}</p>
                        <p style="color: #e0e0e0; margin: 5px 0;"><strong>Attempts:</strong> ${data.attempts ? data.attempts.toLocaleString() : "1"}</p>
                        <p style="color: #e0e0e0; margin: 5px 0;"><strong>Time Taken:</strong> ${timeTaken} seconds</p>
                    </div>
                `;
            } else {
                // FAIL STATE (Red Box)
                resultBox.innerHTML = `
                    <div style="border: 1px solid #ff003c; padding: 15px; border-radius: 5px; margin-top: 15px; background: rgba(255, 0, 60, 0.05);">
                        <h3 style="color: #ff003c; margin-top: 0; margin-bottom: 10px;">🔒 Attack Failed</h3>
                        <p style="color: #e0e0e0; margin: 5px 0;">The algorithm could not crack the password within the safety limits.</p>
                        <p style="color: #e0e0e0; margin: 5px 0;"><strong>Time Taken:</strong> ${timeTaken} seconds</p>
                    </div>
                `;
            }
        
        // CHECK 2: Are we running the AI Strength Analyzer?
        } else if (endpoint === 'strength') {
            
            // Helper function to beautifully format nested JSON objects
            function formatData(obj, depth = 0) {
                let html = '';
                let indent = '&nbsp;'.repeat(depth * 6); // Add visual indents for nested items
                
                for (const [key, value] of Object.entries(obj)) {
                    let cleanKey = key.replace(/_/g, ' ').toUpperCase();
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        // If it's a nested object (like Zxcvbn details), print title and dig deeper
                        html += `<p style="margin: 6px 0; color: #a0a0a0;">${indent}<strong>[ ${cleanKey} ]</strong></p>`;
                        html += formatData(value, depth + 1);
                    } else {
                        // If it's a normal value or a list of suggestions, print it in neon blue
                        let cleanValue = Array.isArray(value) ? (value.length > 0 ? value.join(', ') : 'None') : value;
                        html += `<p style="margin: 4px 0; color: #e0e0e0;">${indent}<strong>${cleanKey}:</strong> <span style="color: #00ffcc;">${cleanValue}</span></p>`;
                    }
                }
                return html;
            }

            let aiDetails = formatData(data);

            // AI STATE (Cyan/Blue Box)
            resultBox.innerHTML = `
                <div style="border: 1px solid #00ffcc; padding: 15px; border-radius: 5px; margin-top: 15px; background: rgba(0, 255, 204, 0.05);">
                    <h3 style="color: #00ffcc; margin-top: 0; margin-bottom: 15px;">🧠 AI Analysis Complete</h3>
                    ${aiDetails}
                </div>
            `;
            
        } else {
            // Fallback just in case
            resultBox.innerHTML = `<pre style="white-space: pre-wrap; color: #00ffcc;">${JSON.stringify(data, null, 2)}</pre>`;
        }
        
    } catch (error) {
        resultBox.innerHTML = `<div style="color: #ff003c; margin-top: 10px;">❌ Error: Make sure your Python server is running!</div>`;
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

// Fetch and display MySQL database history
async function loadHistory() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return; 

    try {
        const response = await fetch('http://127.0.0.1:5000/api/history');
        const historyData = await response.json();
        
        tableBody.innerHTML = ''; 
        
        if (historyData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No attacks recorded yet. Go run an attack!</td></tr>';
            return;
        }

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

window.onload = loadHistory;

// Ask Python to generate a secure password
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
        
        resultBox.innerHTML = `<pre style="font-size: 20px; text-align: center; color: #00ffcc; font-weight: bold; letter-spacing: 2px;">${data.secure_password}</pre>`;
        
    } catch (error) {
        resultBox.innerHTML = "<pre style='color: #ff003c;'>❌ Error: Make sure your Python server is running!</pre>";
    }
}