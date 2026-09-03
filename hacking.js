// Filter Tools Function
function filterTools(category) {
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('.hacking-tool-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Modal Functions
const toolModal = document.getElementById('toolModal');
const modalTitle = document.getElementById('modalTitle');
const toolInput = document.getElementById('toolInput');
const modalLaunchBtn = document.getElementById('modalLaunchBtn');

const toolConfig = {
    'IP Address Lookup': {
        placeholder: 'Enter IP address (e.g., 8.8.8.8)',
        buttonText: 'Trace IP Address'
    },
    'Social Media Scraper': {
        placeholder: 'Enter username or profile URL',
        buttonText: 'Scrape Profile'
    },
    'Domain Lookup': {
        placeholder: 'Enter domain (e.g., example.com)',
        buttonText: 'Get Domain Info'
    }
};

function openToolModal(toolName) {
    modalTitle.textContent = toolName;
    
    if (toolConfig[toolName]) {
        toolInput.placeholder = toolConfig[toolName].placeholder;
        modalLaunchBtn.textContent = toolConfig[toolName].buttonText;
    }
    
    toolModal.style.display = "block";
}

function closeModal() {
    toolModal.style.display = "none";
}

function executeTool() {
    const inputValue = toolInput.value;
    
    if (!inputValue) {
        alert('Please enter a valid target.');
        return;
    }
    
    // Yahan aap real API calls kar sakte hain
    alert(`Scanning ${modalTitle.textContent} for: ${inputValue}\n\nResult will be displayed here soon!`);
    
    closeModal();
}

window.onclick = function(event) {
    if (event.target == toolModal) {
        closeModal();
    }
};