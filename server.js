const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Render port
const PORT = process.env.PORT || 3000;

// CORS - Production ready
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Static files serve karo (agar frontend bhi same server se serve karna ho)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ================== PHONE NUMBER LOOKUP ==================
const APIS = {
    "phone": {
        "name": "📱 Phone Number",
        "endpoint": "https://shuruuu-num-to-info-welcome-7days.vercel.app/apis/num_info_v1?key=WELCOME&num="
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

        if (!response.ok || data.status !== "success") {
            return res.status(404).json({ error: "No data found" });
        }

        return res.json({
            success: true,
            api: apiInfo.name,
            value: value,
            total_results: data.total_results || 0,
            data: data.result || []
        });
    } catch (error) {
        console.error('[Phone Proxy Error]', error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// ================== VEHICLE INFO PROXY ==================
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

// ================== PINCODE INFO PROXY ==================
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

app.get('/number-info', (req, res) => {
    res.sendFile(path.join(__dirname, 'number-info.html'));
});

app.get('/vehicle-info', (req, res) => {
    res.sendFile(path.join(__dirname, 'vehicle-info.html'));
});

app.get('/pincode-info', (req, res) => {
    res.sendFile(path.join(__dirname, 'pincode-info.html'));
});

app.get('/hacking', (req, res) => {
    res.sendFile(path.join(__dirname, 'hacking.html'));
});

// ================== API CHECK ==================
app.get('/api', (req, res) => {
    res.json({ message: "CyberFoks API Server is Running!" });
});

// ================== SERVER START ==================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});