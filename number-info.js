// API Config
const API_URL = "http://localhost:3000/api/lookup";
const API_KEY = "Sahil";

// ==================== MATRIX RAIN ====================
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.random() * alphabet.length);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==================== BOOT SEQUENCE ====================
const bootText = document.getElementById('bootSequence');
const bootMessages = [
    "[ OK ] Initializing CyberFoks OS...",
    "[ OK ] Loading Kernel Modules...",
    "[ OK ] Establishing Secure Connection...",
    "[ OK ] Connecting to OSINT Database...",
    "[ OK ] System Ready. Awaiting Target..."
];

let bootIndex = 0;
const bootInterval = setInterval(() => {
    bootText.textContent = bootMessages[bootIndex];
    bootIndex++;
    if (bootIndex >= bootMessages.length) {
        clearInterval(bootInterval);
        bootText.textContent = ">_ SYSTEM READY. AWAITING TARGET...";
    }
}, 800);

// ==================== 3D TILT EFFECT ====================
const lookupBox = document.getElementById('lookupBox');

lookupBox.addEventListener('mousemove', (e) => {
    const rect = lookupBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    lookupBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

lookupBox.addEventListener('mouseleave', () => {
    lookupBox.style.transform = 'rotateX(0) rotateY(0)';
});

// ==================== COUNTRY CHECK ====================
function checkCountry() {
    const select = document.getElementById('countrySelect');
    const scanBtn = document.getElementById('scanBtn');
    
    if (select.value !== 'india') {
        scanBtn.disabled = true;
        scanBtn.classList.add('disabled');
        scanBtn.innerHTML = 'Coming Soon...';
    } else {
        scanBtn.disabled = false;
        scanBtn.classList.remove('disabled');
        scanBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> Initiate Scan`;
    }
}

// ==================== FETCH NUMBER INFO ====================
async function fetchNumberInfo() {
    const phoneInput = document.getElementById('phoneInput');
    const resultTerminal = document.getElementById('resultTerminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const resultMessage = document.getElementById('resultMessage');
    const scanBtn = document.getElementById('scanBtn');
    const radar = document.getElementById('radar');

    scanBtn.disabled = true;
    scanBtn.classList.add('disabled');
    radar.classList.add('active'); // Radar start

    const number = phoneInput.value.trim();

    if (!number || number.length !== 10) {
        resultMessage.style.display = 'block';
        resultMessage.textContent = "Please enter a valid 10-digit Indian phone number.";
        scanBtn.disabled = false;
        scanBtn.classList.remove('disabled');
        radar.classList.remove('active');
        return;
    }

    resultMessage.style.display = 'none';
    resultTerminal.style.display = 'block';

    // Hacker Style Loading Animation
    const loadingPhrases = [
        "[+] SCANNING TARGET...",
        "[+] TRACING ROUTE...",
        "[+] EXTRACTING DATA...",
        "[+] DECRYPTING INFO...",
        "[+] PROCESSING RESULTS...",
        "[+] ANALYZING PATTERNS...",
        "[+] CROSS REFERENCING...",
        "[+] VERIFYING INTEGRITY..."
    ];

    let loadingIndex = 0;
    terminalOutput.innerHTML = `<div class="result-loading">${loadingPhrases[0]}</div>`;

    // Loading Animation Interval
    const loadingInterval = setInterval(() => {
        loadingIndex++;
        if (loadingIndex < loadingPhrases.length) {
            terminalOutput.innerHTML = `<div class="result-loading">${loadingPhrases[loadingIndex]}</div>`;
        }
    }, 400);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                phone: number,
                api_key: API_KEY
            })
        });

        const data = await response.json();

        // Stop loading
        clearInterval(loadingInterval);
        radar.classList.remove('active');
        
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

        if (data.records && data.records.length > 0) {
            for (let i = 0; i < data.records.length; i++) {
                const record = data.records[i];
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
        clearInterval(loadingInterval);
        radar.classList.remove('active');
        terminalOutput.innerHTML = `<div style="color:red;">Connection Error. Please check server.</div>`;
    }

    scanBtn.disabled = false;
    scanBtn.classList.remove('disabled');
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    checkCountry();
});

document.getElementById('phoneInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') fetchNumberInfo();
});