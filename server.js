// ============================
// CYBERFOKS OSINT SERVER (Worker)
// ============================

// CORS Headers (Frontend ko connect karne ke liye)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request) {
    // OPTIONS (Preflight) Request Handle
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Main Logic
    const response = await handleRequest(request);

    // Response mein CORS headers add karein
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
  }
};

async function handleRequest(request) {
  const url = new URL(request.url);

  // 1. Root Route (Test karne ke liye)
  if (url.pathname === '/') {
    return new Response(JSON.stringify({ message: "CyberFoks API Server is Running!" }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. API Lookup Route
  if (url.pathname === '/api/lookup') {
    // Aapki External API (GET) use karti hai
    if (request.method === 'GET') {
      const searchParams = url.searchParams;
      const phone = searchParams.get('mobile');

      if (!phone) {
        return new Response(JSON.stringify({ error: "Please provide a phone number" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // External API Call
      try {
        const externalAPI = "https://ethicaltabbo.in/api/lookup";
        const externalKey = "Sahil";
        const externalUrl = `${externalAPI}?key=${externalKey}&mobile=${phone}`;

        const externalResponse = await fetch(externalUrl);
        const externalData = await externalResponse.json();

        // Final Data Return
        const finalData = {
          phone: externalData.phone || phone,
          valid: externalData.valid || true,
          country: externalData.country || "N/A",
          country_code: externalData.country_code || "",
          location: externalData.location || "N/A",
          carrier: externalData.carrier || "N/A",
          line_type: externalData.line_type || "N/A",
          breach_status: externalData.breach_status || "No known breaches",
          total_records: externalData.total_records || 0,
          data: externalData.data || []
        };

        return new Response(JSON.stringify(finalData), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // POST request handle karein (agar frontend POST bhejta hai)
    if (request.method === 'POST') {
      const requestBody = await request.json();
      const phone = requestBody.phone;

      if (!phone) {
        return new Response(JSON.stringify({ error: "Please provide a phone number" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // External API Call
      try {
        const externalAPI = "https://ethicaltabbo.in/api/lookup";
        const externalKey = "Sahil";
        const externalUrl = `${externalAPI}?key=${externalKey}&mobile=${phone}`;

        const externalResponse = await fetch(externalUrl);
        const externalData = await externalResponse.json();

        // Final Data Return
        const finalData = {
          phone: externalData.phone || phone,
          valid: externalData.valid || true,
          country: externalData.country || "N/A",
          country_code: externalData.country_code || "",
          location: externalData.location || "N/A",
          carrier: externalData.carrier || "N/A",
          line_type: externalData.line_type || "N/A",
          breach_status: externalData.breach_status || "No known breaches",
          total_records: externalData.total_records || 0,
          data: externalData.data || []
        };

        return new Response(JSON.stringify(finalData), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  // 3. Agar route match nahi hua
  return new Response(JSON.stringify({ error: "Route not found" }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}