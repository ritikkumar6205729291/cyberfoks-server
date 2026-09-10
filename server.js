const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ================== MIDDLEWARE ==================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ================== STATIC FILES ==================
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ================== API TEST ==================
app.get('/api', (req, res) => {
    res.json({ message: "API is working!" });
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

// ================== PHONE LOOKUP (Old Route) ==================
const APIS = {
    "phone": {
        "name": "📱 Phone Number",
        "endpoint": "https://anishexploits.com/api/api.php?key=fokstech&num="
    }
};

app.get('/api/lookup/:type', async (req, res) => {
    const { type } = req.params;
    const value = req.query.value;

    if (!APIS[type]) {
        return res.status(404).json({ error: "API type not found" });
    }
    if (!value) {
        return res.status(400).json({ error: "Please provide a value" });
    }

    const apiInfo = APIS[type];
    const url = apiInfo.endpoint + encodeURIComponent(value);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.data || data.data.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }

        return res.json({
            success: true,
            api: apiInfo.name,
            value: value,
            total_results: data.data.length,
            data: data.data
        });
    } catch (error) {
        console.error('[Phone Proxy Error]', error.message);
        return res.status(500).json({ error: "Internal Server Error" });
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

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/documentation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'documentation.html'));
});

// ================== 404 HANDLER ==================
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ================== SERVER START ==================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Home: http://localhost:${PORT}/`);
    console.log(`📱 Number: http://localhost:${PORT}/number-info.html`);
    console.log(`🚗 Vehicle: http://localhost:${PORT}/vehicle-info.html`);
    console.log(`📮 Pincode: http://localhost:${PORT}/pincode-info.html`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
});