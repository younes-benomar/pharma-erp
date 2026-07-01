const axios = require('axios');

async function testAPI() {
    try {
        const payload = {
            client_schema: 'dbo', // Wait, the previous code had 'public', but in the first screenshot (from the first message), the old code had 'dbo'. Let's check what the API expects.
            source_type: 'db_latest',
            limit: 10,
            do_domaine: [0],
            do_type: [6, 7]
        };
        const response = await axios.post('http://192.168.5.199:8000/api/referentiel/documents-entete', payload);
        console.log("Status:", response.status);
        console.log("Data keys:", Object.keys(response.data));
        console.log("Total rows:", response.data.total_rows);
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
