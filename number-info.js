// API Config
const API_URL = "https://cyberfoks-server.onrender.com/api/lookup";
// Hacker Style Loading Animation
const scanMessages = [
    "[+] Initializing OSINT Engine...",
    "[+] Connecting to Secure Database...",
    "[+] Bypassing Firewalls...",
    "[+] Tracing Mobile Number...",
    "[+] Extracting Personal Records...",
    "[+] Decrypting Encrypted Data...",
    "[+] Cross-Referencing Public Databases...",
    "[+] Compiling Results...",
    "[+] FINALIZING TARGET DATA..."
];

let scanInterval = null;

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

    // Loading Animation Start
    let msgIndex = 0;
    terminalOutput.innerHTML = `<div class="result-loading">${scanMessages[0]}</div>`;
    
    scanInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < scanMessages.length) {
            terminalOutput.innerHTML = `<div class="result-loading">${scanMessages[msgIndex]}</div>`;
        }
    }, 500);

    try {
        const response = await fetch(`${API_URL}/phone?value=${number}`);
        const data = await response.json();

        // Animation Stop
        clearInterval(scanInterval);

        if (!response.ok || data.error) {
            terminalOutput.innerHTML = `<div style="color:red;">Error: ${data.error || 'Request failed'}</div>`;
            scanBtn.disabled = false;
            scanBtn.classList.remove('disabled');
            return;
        }

        // Result Display
        let html = '';
        html += `<div class="result-line"><span class="result-label">🎯 Target:</span> ${number}</div>`;
        html += `<div class="result-line"><span class="result-label">📊 Total Results:</span> ${data.total_results || 0}</div>`;

        if (data.data && data.data.length > 0) {
            for (let i = 0; i < data.data.length; i++) {
                const record = data.data[i];
                html += `<div class="hacker-profile-box" style="margin-top: 15px;">`;
                html += `<div style="color: var(--accent); font-weight: bold;">👤 PROFILE #${i + 1}</div>`;
                html += `<div><strong>Name:</strong> ${record.name || 'N/A'}</div>`;
                html += `<div><strong>Father Name:</strong> ${record.fname || 'N/A'}</div>`;
                html += `<div><strong>Mobile:</strong> ${record.mobile || 'N/A'}</div>`;
                html += `<div><strong>Email:</strong> ${record.email || 'N/A'}</div>`;
                html += `<div><strong>Address:</strong> ${record.address || 'N/A'}</div>`;
                html += `<div><strong>Circle:</strong> ${record.circle || 'N/A'}</div>`;
                html += `<div><strong>Aadhaar:</strong> ${record.aadhar || 'N/A'}</div>`;
                html += `</div>`;
            }
        } else {
            html += `<div class="result-line" style="color:red;">No real data found for this number.</div>`;
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
        clearInterval(scanInterval);
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