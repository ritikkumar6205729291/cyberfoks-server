// ============================================================
// CyberFoks - Main Script
// Google Analytics + Header + Search + Popup
// ============================================================

// ==================== GOOGLE ANALYTICS ====================
(function() {
    const GA_ID = 'G-877Z9TQVVX';

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
        page_title: document.title,
        page_location: window.location.href
    });

    // ========== EVENT TRACKING ==========
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || !link.href) return;

        const href = link.getAttribute('href') || '';

        // Tool Launch Tracking
        const toolMap = {
            'number-info.html': 'Phone Number Info',
            'vehicle-info.html': 'Vehicle Info',
            'pincode-info.html': 'Pincode Lookup',
            'temp-mail.html': 'Temp Mail'
        };

        for (const [key, name] of Object.entries(toolMap)) {
            if (href.includes(key)) {
                gtag('event', 'tool_launch', { 'tool_name': name });
                break;
            }
        }

        // WhatsApp Click
        if (link.href.includes('wa.me')) {
            gtag('event', 'whatsapp_click', { 'link_url': link.href });
        }

        // Social Click
        let platform = null;
        if (link.href.includes('instagram.com')) platform = 'Instagram';
        else if (link.href.includes('t.me')) platform = 'Telegram';
        else if (link.href.includes('youtube.com')) platform = 'YouTube';
        else if (link.href.includes('whatsapp.com')) platform = 'WhatsApp';

        if (platform) {
            gtag('event', 'social_click', { 'platform': platform });
        }
    });
})();

// ==================== MAIN SCRIPT ====================
document.addEventListener('DOMContentLoaded', function() {

    // ==================== HEADER & MOBILE MENU ====================
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav') || document.getElementById('main-nav');

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Hamburger toggle
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) &&
                !hamburger.contains(e.target)) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // ==================== SEARCH BOX ====================
    const toolSearch = document.getElementById('toolSearch');
    const searchButton = document.querySelector('.nav-search button');

    window.performSearch = function() {
        const query = (toolSearch?.value || '').toLowerCase().trim();

        if (query === '') {
            alert('Please type something to search!');
            return;
        }

        if (query.includes('phone') || query.includes('number') || query.includes('mobile')) {
            window.location.href = 'number-info.html';
        }
        else if (query.includes('vehicle') || query.includes('rc') || query.includes('car')) {
            window.location.href = 'vehicle-info.html';
        }
        else if (query.includes('pincode') || query.includes('postal') || query.includes('zip')) {
            window.location.href = 'pincode-info.html';
        }
        else if (query.includes('temp') || query.includes('mail') || query.includes('email')) {
            window.location.href = 'temp-mail.html';
        }
        else if (query.includes('hack') || query.includes('tool')) {
            window.location.href = 'hacking.html';
        }
        else if (query.includes('doc') || query.includes('guide') || query.includes('help')) {
            window.location.href = 'documentation.html';
        }
        else if (query.includes('contact') || query.includes('support')) {
            window.location.href = 'contact.html';
        }
        else {
            window.location.href = 'index.html';
        }
    };

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (toolSearch) {
        toolSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // ==================== LOGIN POPUP ====================
    window.showLoginPopup = function() {
        const modal = document.getElementById('loginModal');
        if (modal) modal.classList.add('active');
    };

    window.closeLoginPopup = function() {
        const modal = document.getElementById('loginModal');
        if (modal) modal.classList.remove('active');
    };

    document.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (modal && modal.classList.contains('active')) {
            if (event.target === modal) {
                closeLoginPopup();
            }
        }
    });

});