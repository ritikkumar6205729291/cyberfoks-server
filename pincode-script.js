// Pincode Lookup Logic - Blue Theme
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('pincodeInput');
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

    function createCard(office, index) {
        const card = document.createElement('div');
        card.className = 'result-card animate-card';
        card.style.animationDelay = `${index * 0.08}s`;

        const deliveryBadge = office.DeliveryStatus === 'Delivery'
            ? '<span class="badge badge-delivery"><i class="fas fa-check-circle"></i> Delivery</span>'
            : '<span class="badge badge-non-delivery"><i class="fas fa-times-circle"></i> Non-Delivery</span>';

        const branchBadge = office.BranchType === 'Sub Post Office'
            ? '<span class="badge badge-sub"><i class="fas fa-building"></i> Sub PO</span>'
            : '<span class="badge badge-branch"><i class="fas fa-code-branch"></i> Branch PO</span>';

        card.innerHTML = `
            <div class="office-name">
                <span><i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i> ${office.Name}</span>
                ${deliveryBadge}
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-hashtag"></i> Pincode</span>
                <span class="detail-value"><strong>${office.Pincode}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-city"></i> District</span>
                <span class="detail-value">${office.District}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-layer-group"></i> Block</span>
                <span class="detail-value">${office.Block}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-sitemap"></i> Division</span>
                <span class="detail-value">${office.Division}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-globe"></i> Region</span>
                <span class="detail-value">${office.Region}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-circle"></i> Circle</span>
                <span class="detail-value">${office.Circle}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-map"></i> State</span>
                <span class="detail-value"><strong>${office.State}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-tag"></i> Branch Type</span>
                <span class="detail-value">${branchBadge}</span>
            </div>
        `;
        return card;
    }

    async function searchPincode(pincode) {
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            addTerminalLine('Invalid pincode format. Enter 6-digit pincode.', 'error');
            showError('Invalid pincode. Please enter a 6-digit number (e.g., 804403)');
            setLoading(false);
            return;
        }

        hideError();
        clearTerminal();
        resultsContainer.classList.remove('show');
        
        addTerminalLine(`Initializing Pincode OSINT for: ${pincode}`, 'info');
        addTerminalLine('Connecting to India Post API...', 'info');
        setLoading(true);

        let dots = '';
        const typingInterval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            const lastLine = terminal.lastElementChild;
            if (lastLine && lastLine.textContent.includes('Connecting to India Post API')) {
                lastLine.textContent = `ℹ️ Connecting to India Post API${dots}`;
            }
        }, 500);

        try {
            const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
            const response = await fetch(apiUrl);
            clearInterval(typingInterval);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            addTerminalLine('Response received successfully', 'success');

            if (data && data[0] && data[0].Status === 'Success') {
                const result = data[0];
                const offices = result.PostOffice || [];

                addTerminalLine(`Found ${offices.length} post office(s)`, 'success');
                addTerminalLine(`📍 District: ${offices[0]?.District || 'N/A'}`, 'info');
                addTerminalLine(`📍 State: ${offices[0]?.State || 'N/A'}`, 'info');
                addTerminalLine('Scan completed successfully! 🎯', 'success');

                resultsGrid.innerHTML = '';
                offices.forEach((office, index) => {
                    resultsGrid.appendChild(createCard(office, index));
                });
                resultCount.innerHTML = `<i class="fas fa-database"></i> ${offices.length} records found`;
                resultsContainer.classList.add('show');

            } else {
                const msg = data && data[0] ? data[0].Message : 'No data found';
                addTerminalLine(`${msg}`, 'error');
                showError(msg);
            }
        } catch (err) {
            clearInterval(typingInterval);
            addTerminalLine(`${err.message}`, 'error');
            showError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    scanBtn.addEventListener('click', function() {
        searchPincode(input.value.trim());
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            scanBtn.click();
        }
    });

    input.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
        if (this.value.length === 6) {
            hideError();
        }
    });

    setTimeout(() => {
        input.focus();
    }, 500);

    addTerminalLine('Initializing Pincode OSINT...', 'info');
    setTimeout(() => {
        addTerminalLine('Waiting for pincode input...', 'info');
        addTerminalLine('Enter a 6-digit pincode and click "Initiate Scan"', 'warning');
        addTerminalLine('Example: 804403', 'info');
    }, 300);
});