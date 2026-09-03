// ==================== HEADER & MOBILE MENU ====================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== SEARCH BOX WORKING LOGIC ====================
const toolSearch = document.getElementById('toolSearch');
const searchButton = document.querySelector('.nav-search button');

// Search function jo pages par le jayega
function performSearch() {
    const query = toolSearch.value.toLowerCase().trim();

    if (query === '') {
        alert('Please type something to search!');
        return;
    }

    // Page mapping based on keywords
    if (query.includes('phone') || query.includes('number') || query.includes('num') || query.includes('mobile')) {
        window.location.href = 'number-info.html';
    } 
    else if (query.includes('hack') || query.includes('tool') || query.includes('security') || query.includes('cyber')) {
        window.location.href = 'hacking.html';
    } 
    else if (query.includes('doc') || query.includes('guide') || query.includes('api') || query.includes('help')) {
        window.location.href = 'documentation.html';
    } 
    else if (query.includes('contact') || query.includes('support') || query.includes('email') || query.includes('whatsapp')) {
        window.location.href = 'contact.html';
    } 
    else if (query.includes('home') || query.includes('main') || query.includes('start')) {
        window.location.href = 'index.html';
    } 
    else {
        // Agar kuch specific nahi mila, toh home page par le jao
        window.location.href = 'index.html';
    }
}

// Search button click par search karein
if (searchButton) {
    searchButton.addEventListener('click', performSearch);
}

// Enter key dabane par bhi search karein
if (toolSearch) {
    toolSearch.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// ==================== LOGIN POPUP (Coming Soon) ====================
function showLoginPopup() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeLoginPopup() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Modal ke bahar click karne par band karna
document.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (modal && modal.classList.contains('active')) {
        if (event.target === modal) {
            closeLoginPopup();
        }
    }
});