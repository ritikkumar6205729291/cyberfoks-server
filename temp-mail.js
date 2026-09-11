// ============================================================
// CyberFoks - Temp Mail Script
// ============================================================

// API Config - Render Server
const API_BASE = "https://cyberfoks-server.onrender.com/api/tempmail";

let currentEmail = null;
let refreshInterval = null;
let lastMessageIds = new Set();

document.addEventListener('DOMContentLoaded', function() {

    // ========== ELEMENTS ==========
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const emailDisplay = document.getElementById('emailDisplay');
    const emailText = document.getElementById('emailText');
    const ttlInfo = document.getElementById('ttlInfo');
    const hintText = document.getElementById('hintText');
    const inboxContainer = document.getElementById('inboxContainer');
    const messagesList = document.getElementById('messagesList');
    const messageCount = document.getElementById('messageCount');
    const messageView = document.getElementById('messageView');
    const popup = document.getElementById('popupNotification');
    const popupIcon = document.getElementById('popupIcon');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');

    // ========== POPUP ==========
    let popupTimeout;
    function showPopup(title, message, type = 'info') {
        popupTitle.textContent = title;
        popupMessage.textContent = message;

        popup.className = 'popup-notification';
        if (type === 'success') popup.classList.add('success');
        else if (type === 'error') popup.classList.add('error');

        if (type === 'success') popupIcon.className = 'fas fa-check-circle';
        else if (type === 'error') popupIcon.className = 'fas fa-exclamation-circle';
        else popupIcon.className = 'fas fa-envelope';

        popup.classList.add('show');

        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }

    // ========== GENERATE EMAIL ==========
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            try {
                const response = await fetch(`${API_BASE}/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ttl: 3600 })
                });
                const data = await response.json();

                if (data.success && data.mailbox) {
                    currentEmail = data.mailbox.address;
                    emailText.textContent = currentEmail;
                    emailDisplay.style.display = 'flex';
                    hintText.style.display = 'none';
                    lastMessageIds = new Set();

                    // TTL Info
                    const expiresAt = new Date(data.mailbox.expires_at * 1000);
                    ttlInfo.innerHTML = `<i class="fas fa-clock"></i> Expires at: ${expiresAt.toLocaleString()}`;
                    ttlInfo.style.display = 'flex';

                    // Show buttons
                    copyBtn.style.display = 'flex';
                    refreshBtn.style.display = 'flex';
                    deleteBtn.style.display = 'flex';
                    inboxContainer.style.display = 'block';

                    showPopup('Email Generated!', currentEmail, 'success');

                    // Auto-refresh every 1 second
                    if (refreshInterval) clearInterval(refreshInterval);
                    refreshInterval = setInterval(refreshInbox, 1000);

                    refreshInbox();
                } else {
                    showPopup('Error', 'Failed to create mailbox', 'error');
                }
            } catch (error) {
                console.error(error);
                showPopup('Error', error.message, 'error');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Generate Email';
            }
        });
    }

    // ========== COPY EMAIL ==========
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (currentEmail) {
                navigator.clipboard.writeText(currentEmail);
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.background = 'rgba(0, 204, 102, 0.3)';
                copyBtn.style.color = '#00ff41';
                showPopup('Copied!', 'Email address copied', 'success');
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.background = '';
                    copyBtn.style.color = '';
                }, 2000);
            }
        });
    }

    // ========== REFRESH INBOX ==========
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshInbox(true);
        });
    }

    async function refreshInbox(manual = false) {
        if (!currentEmail) return;

        try {
            const response = await fetch(`${API_BASE}/inbox/${encodeURIComponent(currentEmail)}`);
            const data = await response.json();

            if (data.success && data.messages) {
                const messages = data.messages;
                messageCount.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''}`;

                // Detect new messages
                const newMessages = messages.filter(msg => !lastMessageIds.has(msg.id));

                if (newMessages.length > 0 && lastMessageIds.size > 0) {
                    const latest = newMessages[0];
                    showPopup('New Message!', `From: ${latest.sender || 'Unknown'}`, 'success');
                }

                lastMessageIds = new Set(messages.map(m => m.id));

                if (messages.length === 0) {
                    if (manual) {
                        showPopup('No Messages', 'Inbox is empty', 'info');
                    }
                    messagesList.innerHTML = `
                        <div class="no-messages">
                            <i class="fas fa-envelope-open"></i>
                            <p>No messages yet. Waiting for incoming emails...</p>
                        </div>
                    `;
                } else {
                    messagesList.innerHTML = messages.map(msg => `
                        <div class="message-item" onclick="viewMessage('${msg.id}')">
                            <div class="sender"><i class="fas fa-user"></i> ${escapeHtml(msg.sender || 'Unknown')}</div>
                            <div class="subject">${escapeHtml(msg.subject || '(No Subject)')}</div>
                            <div class="time"><i class="fas fa-clock"></i> ${new Date(msg.received_at * 1000).toLocaleString()}</div>
                        </div>
                    `).join('');
                }
            }
        } catch (error) {
            console.error('Refresh error:', error);
        }
    }

    // ========== VIEW MESSAGE ==========
    window.viewMessage = async function(id) {
        messageView.innerHTML = '<p style="color: #667799; padding: 20px;">Loading message...</p>';

        try {
            const response = await fetch(`${API_BASE}/message/${id}`);
            const data = await response.json();

            if (data.success && data.message) {
                const msg = data.message;
                messageView.innerHTML = `
                    <div class="message-view">
                        <div class="field">
                            <div class="label">From</div>
                            <div class="value">${escapeHtml(msg.sender || 'Unknown')}</div>
                        </div>
                        <div class="field">
                            <div class="label">To</div>
                            <div class="value">${escapeHtml(msg.recipient || currentEmail)}</div>
                        </div>
                        <div class="field">
                            <div class="label">Subject</div>
                            <div class="value">${escapeHtml(msg.subject || '(No Subject)')}</div>
                        </div>
                        <div class="field">
                            <div class="label">Body</div>
                            <div class="body-content">${escapeHtml(msg.body || msg.text || '(No Body)')}</div>
                        </div>
                    </div>
                `;
            } else {
                messageView.innerHTML = '<p style="color: #ff4757; padding: 20px;">Failed to load message</p>';
            }
        } catch (error) {
            messageView.innerHTML = '<p style="color: #ff4757; padding: 20px;">Error: ' + error.message + '</p>';
        }
    };

    // ========== DELETE MAILBOX ==========
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!currentEmail || !confirm('Are you sure you want to delete this mailbox?')) return;

            try {
                await fetch(`${API_BASE}/delete/${encodeURIComponent(currentEmail)}`, {
                    method: 'DELETE'
                });

                if (refreshInterval) clearInterval(refreshInterval);
                currentEmail = null;
                lastMessageIds = new Set();

                emailDisplay.style.display = 'none';
                ttlInfo.style.display = 'none';
                copyBtn.style.display = 'none';
                refreshBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
                inboxContainer.style.display = 'none';
                messageView.innerHTML = '';
                hintText.style.display = 'block';

                showPopup('Deleted!', 'Mailbox has been deleted', 'success');
            } catch (error) {
                showPopup('Error', error.message, 'error');
            }
        });
    }

    // ========== ESCAPE HTML ==========
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

});