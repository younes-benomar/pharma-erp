const axios = require('axios');

async function testAPI() {
    try {
        const payload = {
            client_schema: "dbo", 
            source: {
              type: "db_latest",
              period: { mode: "none", start_date: `2024-01-01`, end_date: `2024-12-31` }
            },
            filters: { do_domaine: [0] }, 
            output: { format: "table", limit: 5000 }
        };
        const response = await axios.post('http://192.168.5.199:8000/api/transactions/ventes', payload);
        console.log("Status:", response.status);
        console.log("Total rows:", response.data.total_rows || (response.data.data && response.data.data.length));
        if (response.data.data && response.data.data.length > 0) {
            console.log("First item:", JSON.stringify(response.data.data[0], null, 2));
        } else {
            console.log("No data returned or empty array.");
        }
    } catch (error) {
        console.error("Error calling API:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testAPI();
