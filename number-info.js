// ============================================================
// CyberFoks - Number Info Script
// Render Ready
// ============================================================

// API Config
const API_URL = "https://cyberfoks-server.onrender.com/api/lookup";

// Scan messages for loading animation
const scanMessages = [
    "> Initializing OSINT engine...",
    "> Connecting to secure servers...",
    "> Bypassing security layers...",
    "> Fetching personal records...",
    "> Decrypting data packets...",
    "> Cross-referencing databases...",
    "> Extracting information...",
    "> Finalizing results..."
];

let scanInterval = null;

// ========== MAIN FUNCTION ==========
async function fetchNumberInfo() {
    
    const phoneInput = document.getElementById('phoneInput');
    const resultTerminal = document.getElementById('resultTerminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const resultMessage = document.getElementById('resultMessage');
    const scanBtn = document.getElementById('scanBtn');

    scanBtn.disabled = true;
    scanBtn.classList.add('disabled');

    const number = phoneInput.value.trim();

    // Validation
    if (!number || number.length !== 10 || !/^\d{10}$/.test(number)) {
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

    if (scanInterval) clearInterval(scanInterval);
    scanInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < scanMessages.length) {
            terminalOutput.innerHTML = `<div class="result-loading">${scanMessages[msgIndex]}</div>`;
        }
    }, 800);

    try {
        // API Call
        const response = await fetch(`${API_URL}/phone?value=${encodeURIComponent(number)}`);
        const data = await response.json();

        clearInterval(scanInterval);

        if (!response.ok || !data.success || !data.data || data.data.length === 0) {
            terminalOutput.innerHTML = `<div class="result-error">❌ No data found for this number.</div>`;
            scanBtn.disabled = false;
            scanBtn.classList.remove('disabled');
            return;
        }

        displayResults(data.data, number);

    } catch (error) {
        clearInterval(scanInterval);
        console.error('Error:', error);
        terminalOutput.innerHTML = `<div class="result-error">❌ Failed to fetch data. Please try again.</div>`;
    } finally {
        scanBtn.disabled = false;
        scanBtn.classList.remove('disabled');
    }
}

// ========== DISPLAY RESULTS ==========
function displayResults(records, number) {
    const terminalOutput = document.getElementById('terminalOutput');

    let html = `<div class="result-success">✅ Found ${records.length} record(s) for ${number}</div>`;

    records.forEach((record, index) => {
        html += `
            <div class="result-card" style="animation-delay: ${index * 0.1}s;">
                <div class="result-card-header">
                    <i class="fas fa-user"></i> Record #${index + 1}
                </div>
                <div class="result-row">
                    <span class="result-label">Name:</span>
                    <span class="result-value">${record.name || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Father Name:</span>
                    <span class="result-value">${record.father_name || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Mobile:</span>
                    <span class="result-value">${record.mobile || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Alternate:</span>
                    <span class="result-value">${record.alternate || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Aadhaar:</span>
                    <span class="result-value">${record.aadhaar || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Address:</span>
                    <span class="result-value">${record.address || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Circle:</span>
                    <span class="result-value">${record.circle || 'N/A'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Email:</span>
                    <span class="result-value">${record.email || 'N/A'}</span>
                </div>
            </div>
        `;
    });

    terminalOutput.innerHTML = html;
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
    const scanBtn = document.getElementById('scanBtn');
    const phoneInput = document.getElementById('phoneInput');

    if (scanBtn) {
        scanBtn.addEventListener('click', fetchNumberInfo);
    }

    if (phoneInput) {
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchNumberInfo();
            }
        });

        // Only digits, max 10
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
});