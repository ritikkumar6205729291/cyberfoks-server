// ============================================================
// CyberFoks - Vehicle Info Lookup Script
// Render Host Ready
// ============================================================

// API URL - Render Server
const API_URL = "https://cyberfoks-server.onrender.com/api";

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('rcInput');
    const scanBtn = document.getElementById('scanBtn');
    const terminal = document.getElementById('terminalBody');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultCount = document.getElementById('resultCount');
    const errorMsg = document.getElementById('errorMsg');
    const errorText = document.getElementById('errorText');

    // Icons for terminal
    const icons = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };

    // ================== TERMINAL FUNCTIONS ==================
    function addTerminalLine(text, type = 'info') {
        const line = document.createElement('div');
        line.className = `line ${type}`;
        const icon = icons[type] || icons.info;
        line.innerHTML = `<span style="margin-right: 8px;">${icon}</span> ${text}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function clearTerminal() {
        terminal.innerHTML = '';
    }

    // ================== ERROR / LOADING ==================
    function showError(msg) {
        errorText.textContent = msg;
        errorMsg.classList.add('show');
        resultsContainer.classList.remove('show');
    }

    function hideError() {
        errorMsg.classList.remove('show');
    }

    function setLoading(loading) {
        if (loading) {
            scanBtn.disabled = true;
            scanBtn.innerHTML = '<span class="spinner"></span> Scanning...';
        } else {
            scanBtn.disabled = false;
            scanBtn.innerHTML = '<i class="fas fa-rocket"></i> Initiate Scan';
        }
    }

    // ================== CREATE CARD ==================
    function createCard(title, icon, details, index) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.style.animationDelay = `${index * 0.08}s`;

        let rows = '';
        details.forEach(item => {
            if (item.value === undefined || item.value === null || item.value === '') {
                item.value = 'NA';
            }

            let badgeHtml = '';
            if (item.badge) {
                const badgeClass = item.badge === 'Expired' ? 'badge-expired' : 
                                  item.badge === 'Active' ? 'badge-active' : 'badge-success';
                badgeHtml = `<span class="badge ${badgeClass}">${item.badge}</span>`;
            }

            rows += `
                <div class="detail-row">
                    <span class="detail-label"><i class="fas ${item.icon}"></i> ${item.label}</span>
                    <span class="detail-value">${item.value} ${badgeHtml}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="card-title">
                <span><i class="fas ${icon}"></i> ${title}</span>
            </div>
            ${rows}
        `;
        return card;
    }

    // ================== DISPLAY RESULTS ==================
    function displayResults(data) {
        resultsGrid.innerHTML = '';
        let cardCount = 0;

        // 1. Registration Number
        if (data.registration_number) {
            const card = createCard('Registration Info', 'fa-id-card', [
                { icon: 'fa-hashtag', label: 'Registration Number', value: data.registration_number }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 2. Basic Info
        if (data.basic_info) {
            const b = data.basic_info;
            const card = createCard('Basic Info', 'fa-info-circle', [
                { icon: 'fa-user', label: 'Owner Name', value: b.owner_name },
                { icon: 'fa-map-marker-alt', label: 'City', value: b.city },
                { icon: 'fa-code', label: 'RTO Code', value: b.code },
                { icon: 'fa-car', label: 'Model Name', value: b.model_name },
                { icon: 'fa-map', label: 'Address', value: b.address },
                { icon: 'fa-phone', label: 'Phone', value: b.phone }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 3. Vehicle Details
        if (data.vehicle_details) {
            const v = data.vehicle_details;
            const card = createCard('Vehicle Details', 'fa-car-side', [
                { icon: 'fa-industry', label: 'Maker', value: v.maker },
                { icon: 'fa-car', label: 'Model', value: v.model },
                { icon: 'fa-gas-pump', label: 'Fuel Type', value: v.fuel_type },
                { icon: 'fa-tachometer-alt', label: 'Cubic Capacity', value: v.cubic_capacity },
                { icon: 'fa-users', label: 'Seating Capacity', value: v.seating_capacity },
                { icon: 'fa-tag', label: 'Vehicle Class', value: v.vehicle_class },
                { icon: 'fa-leaf', label: 'Fuel Norms', value: v.fuel_norms }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 4. Ownership Details
        if (data.ownership_details) {
            const o = data.ownership_details;
            const card = createCard('Ownership Details', 'fa-user-tie', [
                { icon: 'fa-user', label: 'Owner Name', value: o.owner_name },
                { icon: 'fa-building', label: 'RTO', value: o.rto }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 5. Insurance Details
        if (data.insurance) {
            const ins = data.insurance;
            const card = createCard('Insurance Details', 'fa-shield-alt', [
                { icon: 'fa-building', label: 'Company', value: ins.company },
                { icon: 'fa-calendar-check', label: 'Expiry Date', value: ins.expiry_date },
                { icon: 'fa-calendar-times', label: 'Valid Upto', value: ins.valid_upto },
                { icon: 'fa-clock', label: 'Expired Days Ago', value: ins.expired_days_ago },
                { icon: 'fa-info-circle', label: 'Status', value: ins.status, badge: ins.status }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 6. Validity Details
        if (data.validity) {
            const val = data.validity;
            const card = createCard('Validity Details', 'fa-calendar-alt', [
                { icon: 'fa-calendar-plus', label: 'Registration Date', value: val.registration_date },
                { icon: 'fa-heartbeat', label: 'Fitness Upto', value: val.fitness_upto },
                { icon: 'fa-file-invoice', label: 'Tax Upto', value: val.tax_upto },
                { icon: 'fa-shield-alt', label: 'Insurance Upto', value: val.insurance_upto },
                { 
                    icon: 'fa-exclamation-triangle', 
                    label: 'Insurance Status', 
                    value: val.insurance_status, 
                    badge: val.insurance_status && val.insurance_status.includes('Expired') ? 'Expired' : 'Active' 
                },
                { icon: 'fa-clock', label: 'Vehicle Age', value: val.vehicle_age }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 7. Other Info
        if (data.other_info) {
            const o = data.other_info;
            const card = createCard('Other Info', 'fa-ellipsis-h', [
                { icon: 'fa-ban', label: 'Blacklist Status', value: o.blacklist_status },
                { icon: 'fa-money-bill', label: 'Financer', value: o.financer },
                { icon: 'fa-file', label: 'NOC', value: o.noc },
                { icon: 'fa-id-card', label: 'Permit Type', value: o.permit_type }
            ], cardCount++);
            resultsGrid.appendChild(card);
        }

        // 8. PUC Details
        if (data.puc_details && Object.keys(data.puc_details).length > 0) {
            const puc = data.puc_details;
            const details = Object.keys(puc).map(key => ({
                icon: 'fa-leaf',
                label: key.replace(/_/g, ' ').toUpperCase(),
                value: puc[key]
            }));
            const card = createCard('PUC Details', 'fa-leaf', details, cardCount++);
            resultsGrid.appendChild(card);
        }

        resultCount.innerHTML = `<i class="fas fa-database"></i> ${cardCount} sections found`;
        resultsContainer.classList.add('show');
    }

    // ================== SEARCH VEHICLE ==================
    async function searchVehicle(rc) {
        // Validate
        if (!rc || rc.length < 5) {
            addTerminalLine('Invalid RC number format. Enter valid RC number.', 'error');
            showError('Invalid RC number. Please enter a valid RC (e.g., BR02AF0245)');
            setLoading(false);
            return;
        }

        hideError();
        clearTerminal();
        resultsContainer.classList.remove('show');

        addTerminalLine(`Initializing Vehicle Info OSINT for: ${rc}`, 'info');
        addTerminalLine('Connecting to CyberFoks Server...', 'info');
        setLoading(true);

        let dots = '';
        const typingInterval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            const lastLine = terminal.lastElementChild;
            if (lastLine && lastLine.textContent.includes('Connecting to CyberFoks Server')) {
                lastLine.innerHTML = `ℹ️ Connecting to CyberFoks Server${dots}`;
            }
        }, 500);

        try {
            // Render API URL
            const apiUrl = `${API_URL}/vehicle-info?rc=${encodeURIComponent(rc)}`;
            addTerminalLine(`Requesting: ${apiUrl}`, 'info');

            const response = await fetch(apiUrl);
            clearInterval(typingInterval);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            addTerminalLine('Response received successfully', 'success');

            if (data && data.status === 'success') {
                addTerminalLine(`Vehicle found: ${data.registration_number || rc}`, 'success');

                if (data.basic_info) {
                    addTerminalLine(`👤 Owner: ${data.basic_info.owner_name || 'NA'}`, 'info');
                    addTerminalLine(`🏙️ City: ${data.basic_info.city || 'NA'}`, 'info');
                }
                if (data.vehicle_details) {
                    addTerminalLine(`🚗 Model: ${data.vehicle_details.model || 'NA'}`, 'info');
                    addTerminalLine(`⛽ Fuel: ${data.vehicle_details.fuel_type || 'NA'}`, 'info');
                }
                if (data.insurance) {
                    const insType = data.insurance.status === 'Expired' ? 'error' : 'success';
                    addTerminalLine(`🛡️ Insurance: ${data.insurance.status || 'NA'}`, insType);
                }

                addTerminalLine('Scan completed successfully! 🎯', 'success');
                displayResults(data);
            } else {
                const msg = data?.message || 'Vehicle not found';
                addTerminalLine(`${msg}`, 'error');
                showError(msg);
            }
        } catch (err) {
            clearInterval(typingInterval);
            addTerminalLine(`Error: ${err.message}`, 'error');
            showError('Failed to fetch vehicle data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    // ================== EVENT LISTENERS ==================
    scanBtn.addEventListener('click', function() {
        searchVehicle(input.value.trim().toUpperCase());
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            scanBtn.click();
        }
    });

    input.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
        hideError();
    });

    setTimeout(() => {
        input.focus();
    }, 500);

    // Initial terminal messages
    addTerminalLine('Initializing Vehicle Info OSINT...', 'info');
    setTimeout(() => {
        addTerminalLine('Waiting for RC number input...', 'info');
        addTerminalLine('Enter RC number and click "Initiate Scan"', 'warning');
        addTerminalLine('Example: BR02AF0245', 'info');
    }, 300);
});