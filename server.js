const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Render ke liye PORT
const PORT = process.env.PORT || 8000;

// CORS - Production ready
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-API-Key']
}));
app.use(express.json());

// ================== STATIC FILES ==================
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ================== API TEST ==================
app.get('/api', (req, res) => {
    res.json({ message: "CyberFoks API Server is Running!" });
});

// ================== PHONE NUMBER API ==================
app.get('/api/lookup/phone', async (req, res) => {
    try {
        const value = req.query.value;
        if (!value) {
            return res.status(400).json({ error: 'Phone number required' });
        }

        const apiUrl = `https://anishexploits.com/api/api.php?key=fokstech&num=${encodeURIComponent(value)}`;
        console.log(`[Proxy] Fetching phone: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        return res.json({
            success: true,
            value: value,
            total_results: data.data.length,
            data: data.data
        });
    } catch (error) {
        console.error('[Phone Proxy Error]', error.message);
        return res.status(500).json({ error: 'Failed to fetch phone data' });
    }
});

// ================== VEHICLE INFO API ==================
app.get('/api/vehicle-info', async (req, res) => {
    try {
        const rc = req.query.rc;
        if (!rc) {
            return res.status(400).json({ error: 'RC number required' });
        }

        const apiUrl = `https://vehicle-info-rc-1.vercel.app/api/vehicle-info?rc=${encodeURIComponent(rc)}`;
        console.log(`[Proxy] Fetching vehicle: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        return res.json(data);
    } catch (error) {
        console.error('[Vehicle Proxy Error]', error.message);
        return res.status(500).json({ error: 'Failed to fetch vehicle data' });
    }
});

// ================== PINCODE INFO API ==================
app.get('/api/pincode-info', async (req, res) => {
    try {
        const pincode = req.query.pincode;
        if (!pincode) {
            return res.status(400).json({ error: 'Pincode required' });
        }

        const apiUrl = `https://api.postalpincode.in/pincode/${encodeURIComponent(pincode)}`;
        console.log(`[Proxy] Fetching pincode: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        return res.json(data);
    } catch (error) {
        console.error('[Pincode Proxy Error]', error.message);
        return res.status(500).json({ error: 'Failed to fetch pincode data' });
    }
});

// ================== TEMP MAIL API ==================
const TAMPMAIL_KEY = "TM_7fK9xP2mQ8vL4nR6sA1zW5";
const TAMPMAIL_BASE = "https://api.tampmail.app";
const TAMPMAIL_DOMAIN = "tampmail.app";

app.get('/api/tempmail/test', (req, res) => {
    res.json({ message: "Temp mail route is working!" });
});

app.post('/api/tempmail/create', async (req, res) => {
    try {
        const response = await fetch(`${TAMPMAIL_BASE}/mailbox`, {
            method: 'POST',
            headers: {
                'X-API-Key': TAMPMAIL_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                ttl: 3600,
                domain: TAMPMAIL_DOMAIN
            })
        });
        const data = await response.json();
        console.log('[TempMail] Created:', data.mailbox?.address);
        return res.json(data);
    } catch (error) {
        console.error('[TempMail Create Error]', error.message);
        return res.status(500).json({ error: 'Failed to create mailbox' });
    }
});

app.get('/api/tempmail/inbox/:address', async (req, res) => {
    try {
        const { address } = req.params;
        console.log('[TempMail] Fetching inbox for:', address);

        const response = await fetch(`${TAMPMAIL_BASE}/mailbox/${encodeURIComponent(address)}`, {
            headers: { 'X-API-Key': TAMPMAIL_KEY }
        });
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('[TempMail Inbox Error]', error.message);
        return res.status(500).json({ error: 'Failed to fetch inbox' });
    }
});

app.get('/api/tempmail/message/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await fetch(`${TAMPMAIL_BASE}/message/${encodeURIComponent(id)}`, {
            headers: { 'X-API-Key': TAMPMAIL_KEY }
        });
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('[TempMail Message Error]', error.message);
        return res.status(500).json({ error: 'Failed to fetch message' });
    }
});

app.delete('/api/tempmail/delete/:address', async (req, res) => {
    try {
        const { address } = req.params;

        const response = await fetch(`${TAMPMAIL_BASE}/mailbox/${encodeURIComponent(address)}`, {
            method: 'DELETE',
            headers: { 'X-API-Key': TAMPMAIL_KEY }
        });
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('[TempMail Delete Error]', error.message);
        return res.status(500).json({ error: 'Failed to delete mailbox' });
    }
});

// ================== HTML PAGES ==================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/hacking.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'hacking.html'));
});

app.get('/number-info.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'number-info.html'));
});

app.get('/vehicle-info.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'vehicle-info.html'));
});

app.get('/pincode-info.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pincode-info.html'));
});

app.get('/temp-mail.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'temp-mail.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/documentation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'documentation.html'));
});

// ================== 404 ==================
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ================== SERVER START ==================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Home: http://localhost:${PORT}/`);
});