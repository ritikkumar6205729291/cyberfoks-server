// ============================================================
// CyberFoks - Contact Page Script
// Sends form data to WhatsApp
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ========== YOUR WHATSAPP NUMBER ==========
    // Country code ke saath, bina +, space, dash ke
    // Example: 91 8674905521  →  918674905521
    const WHATSAPP_NUMBER = "918674905521";

    // ========== FORM SUBMIT ==========
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showToast('Please fill all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';

            // Build WhatsApp message
            const whatsappMessage =
`*New Contact from CyberFoks* 🚀

👤 *Name:* ${name}
📧 *Email:* ${email}
📌 *Subject:* ${subject}

💬 *Message:*
${message}

━━━━━━━━━━━━━━━
Sent from CyberFoks Website`;

            // Encode message
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Build WhatsApp URL
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            // Open WhatsApp
            setTimeout(() => {
                window.open(whatsappURL, '_blank');

                showToast('Opening WhatsApp...', 'success');

                // Reset form
                form.reset();

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';

            }, 800);
        });
    }

    // ========== TOAST NOTIFICATION ==========
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.cyber-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `cyber-toast cyber-toast-${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
                     type === 'error' ? 'fa-exclamation-circle' :
                     'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #25D366, #128C7E)' :
                         type === 'error' ? 'linear-gradient(135deg, #ff4757, #cc2233)' :
                         'linear-gradient(135deg, #1a73e8, #0d47a1)'};
            color: #ffffff;
            padding: 14px 22px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.92rem;
            font-weight: 600;
            z-index: 99999;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            transform: translateX(500px);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            toast.style.transform = 'translateX(500px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ========== INPUT VALIDATION FEEDBACK ==========
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = 'rgba(255, 71, 87, 0.5)';
            } else {
                this.style.borderColor = 'rgba(0, 204, 102, 0.5)';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#1a73e8';
        });
    });

});