const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://cyberfoks.pages.dev', 'https://www.cyberfoks.pages.dev']
}));
app.use(express.json());

// NAYA API URL
const APIS = {
    "phone": {
        "name": "📱 Phone Number",
        "endpoint": "https://shuruuu-num-to-info-welcome-7days.vercel.app/apis/num_info_v1?key=WELCOME&num=",
        "example": "9876543210",
        "emoji": "📱"
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

        // Ab data ka structure "result" array mein hai
        return res.json({
            success: true,
            api: apiInfo.name,
            value: value,
            total_results: data.total_results || 0,
            data: data.result || []
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