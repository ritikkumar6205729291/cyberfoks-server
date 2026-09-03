// API Config - Render URL
const API_URL = "https://cyberfoks-server.onrender.com/api/lookup";

async function fetchNumberInfo() {
    const phoneInput = document.getElementById('phoneInput');
    const resultTerminal = document.getElementById('resultTerminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const resultMessage = document.getElementById('resultMessage');
    const scanBtn = document.getElementById('scanBtn');

    scanBtn.disabled = true;
    scanBtn.classList.add('disabled');

    const number = phoneInput.value.trim();

    if (!number || number.length !== 10) {
        resultMessage.style.display = 'block';
        resultMessage.textContent = "Please enter a valid 10-digit Indian phone number.";
        scanBtn.disabled = false;
        scanBtn.classList.remove('disabled');
        return;
    }

    resultMessage.style.display = 'none';
    resultTerminal.style.display = 'block';
    terminalOutput.innerHTML = '<div class="result-loading">[+] Scanning Target...</div>';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: number })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            terminalOutput.innerHTML = `<div style="color:red;">Error: ${data.error || 'Request failed'}</div>`;
            scanBtn.disabled = false;
            scanBtn.classList.remove('disabled');
            return;
        }

        // Result Display
        let html = '';
        html += `<div class="result-line"><span class="result-label">🎯 Target:</span> ${data.phone || number}</div>`;
        html += `<div class="result-line"><span class="result-label">📊 Total Records:</span> ${data.total_records || 0}</div>`;

        if (data.data && data.data.length > 0) {
            for (let i = 0; i < data.data.length; i++) {
                const record = data.data[i];
                html += `<div class="hacker-profile-box" style="margin-top: 15px;">`;
                html += `<div style="color: var(--accent); font-weight: bold;">👤 PROFILE #${i + 1}</div>`;
                html += `<div><strong>Name:</strong> ${record.name || 'N/A'}</div>`;
                html += `<div><strong>Father Name:</strong> ${record.father_name || 'N/A'}</div>`;
                html += `<div><strong>Mobile:</strong> ${record.mobile || 'N/A'}</div>`;
                html += `<div><strong>Email:</strong> ${record.email || 'N/A'}</div>`;
                html += `<div><strong>Address:</strong> ${record.address || 'N/A'}</div>`;
                html += `<div><strong>Circle:</strong> ${record.circle || 'N/A'}</div>`;
                html += `</div>`;
            }
        }

        html += `<div class="result-line osint-links" style="margin-top: 20px;"><span class="result-label">Search Links:</span><br>`;
        html += `<a href="https://www.google.com/search?q=%22${number}%22" target="_blank">Google</a> | `;
        html += `<a href="https://www.google.com/search?q=%22${number}%22+site%3Afacebook.com" target="_blank">Facebook</a> | `;
        html += `<a href="https://www.google.com/search?q=%22${number}%22+site%3Ainstagram.com" target="_blank">Instagram</a> | `;
        html += `<a href="https://www.google.com/search?q=%22${number}%22+site%3Awhatsapp.com" target="_blank">WhatsApp</a>`;
        html += `</div>`;

        terminalOutput.innerHTML = html;
        terminalOutput.innerHTML += `<span class="cursor"></span>`;

    } catch (error) {
        console.error(error);
        terminalOutput.innerHTML = `<div style="color:red;">Connection Error. Please check server.</div>`;
    }

    scanBtn.disabled = false;
    scanBtn.classList.remove('disabled');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkCountry();
});

document.getElementById('phoneInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') fetchNumberInfo();
});
