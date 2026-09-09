const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/pincode', async (req, res) => {
    const { api_key, pincode } = req.query;

    if (api_key !== "DEMOFUCK") {
        return res.status(401).json({ error: "Missing or invalid API key" });
    }

    if (!pincode || !/^\d{6}$/.test(pincode)) {
        return res.status(400).json({ error: "Invalid pincode. Must be 6 digits." });
    }

    try {
        const externalAPI = "https://anshaft-info-eight.vercel.app/api/pincode";
        const externalURL = `${externalAPI}?api_key=${api_key}&pincode=${pincode}`;
        
        const externalResponse = await fetch(externalURL);
        const externalData = await externalResponse.json();

        if (!externalResponse.ok || externalData.error) {
            return res.status(404).json({ error: externalData.error || "No data found" });
        }

        return res.json({
            pincode: pincode,
            district: externalData.district || "N/A",
            state: externalData.state || "N/A",
            block: externalData.block || "N/A"
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