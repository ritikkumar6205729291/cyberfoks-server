const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS - BILKUL OPEN
app.use(cors());
app.use(express.json());

// External API Config
const EXTERNAL_API_URL = "https://ethicaltabbo.in/api/lookup";
const EXTERNAL_API_KEY = "Sahil";

app.post('/api/lookup', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Please provide a phone number" });
    }

    const cleanNumber = phone.replace(/[^0-9+]/g, '');

    try {
        const externalResponse = await fetch(`${EXTERNAL_API_URL}?key=${EXTERNAL_API_KEY}&mobile=${cleanNumber}`, {
            method: 'GET'
        });
        const externalData = await externalResponse.json();

        if (!externalResponse.ok || externalData.error) {
            return res.status(500).json({ error: externalData.error || "External API error" });
        }

        return res.json({
            phone: externalData.phone || cleanNumber,
            valid: externalData.valid || true,
            country: externalData.country || "N/A",
            country_code: externalData.country_code || "",
            location: externalData.location || "N/A",
            carrier: externalData.carrier || "N/A",
            line_type: externalData.line_type || "N/A",
            breach_status: externalData.breach_status || "No known breaches",
            total_records: externalData.total_records || 0,
            data: externalData.data || []
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "CyberFoks API Server is Running!" });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`);
});