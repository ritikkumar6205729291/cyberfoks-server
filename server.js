const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Allow ALL origins
app.use(cors());
app.use(express.json());

const VALID_API_KEY = "Sahil";
const EXTERNAL_API_URL = "https://ethicaltabbo.in/api/lookup";
const EXTERNAL_API_KEY = "Sahil";

app.post('/api/lookup', async (req, res) => {
    // 1. Internal Key Check (Apna server wala check)
    const apiKey = req.headers['authorization']?.replace('Bearer ', '') || req.body.api_key;
    if (apiKey !== VALID_API_KEY) {
        return res.status(401).json({ error: "Missing API key" });
    }

    // 2. Phone Input
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Please provide a phone number" });
    }

    // 3. Clean Number (Sirf 10 digit Indian number)
    const cleanNumber = phone.replace(/\D/g, '').slice(-10); // Last 10 digits

    try {
        // ====== REAL API CALL (GET Request with Query Params) ======
        // URL format: https://ethicaltabbo.in/api/lookup?key=Sahil&mobile=9876543210
        const externalUrl = `${EXTERNAL_API_URL}?key=${EXTERNAL_API_KEY}&mobile=${cleanNumber}`;
        
        const externalResponse = await fetch(externalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const externalData = await externalResponse.json();

        // Agar external API error deti hai
        if (!externalResponse.ok || externalData.error) {
            return res.status(500).json({ error: externalData.error || "External API error" });
        }

        // ====== FINAL RESPONSE (Real Data) ======
        return res.json({
            phone: externalData.number || cleanNumber,
            valid: true,
            country: "India",
            country_code: "IN",
            total_records: externalData.total_records || 0,
            records: externalData.data || [],
            breach_status: "Clear"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running at http://127.0.0.1:${port}`);
});