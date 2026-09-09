// pincode.js - Server Side Pincode Module
const express = require('express');
const router = express.Router();

// Pincode Endpoint
router.get('/api/pincode', async (req, res) => {
    const { api_key, pincode } = req.query;

    // API Key Check
    if (api_key !== "DEMOFUCK") {
        return res.status(401).json({ error: "Missing or invalid API key" });
    }

    // Pincode Validation
    if (!pincode || !/^\d{6}$/.test(pincode)) {
        return res.status(400).json({ error: "Invalid pincode. Must be 6 digits." });
    }

    try {
        // External API Call
        const externalAPI = "https://anshaft-info-eight.vercel.app/api/pincode";
        const externalURL = `${externalAPI}?api_key=${api_key}&pincode=${pincode}`;
        
        const externalResponse = await fetch(externalURL);
        const externalData = await externalResponse.json();

        if (!externalResponse.ok || externalData.error) {
            return res.status(404).json({ error: externalData.error || "No data found" });
        }

        // Return Data
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

module.exports = router;