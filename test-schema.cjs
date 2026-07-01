const axios = require('axios');

async function testSchemaKeys() {
    console.log("Testing with underscores (client_schema, source_type)...");
    try {
        const payload1 = {
            client_schema: 'dbo',
            source_type: 'db_latest',
            limit: 10,
            do_domaine: [0],
            do_type: [6, 7]
        };
        const res1 = await axios.post('http://192.168.5.199:8000/api/referentiel/documents-entete', payload1);
        console.log("Response 1 Status:", res1.status);
    } catch (e) {
        console.log("Response 1 Error:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }

    console.log("\nTesting WITHOUT underscores (clientschema, sourcetype)...");
    try {
        const payload2 = {
            clientschema: 'dbo',
            sourcetype: 'db_latest',
            limit: 10,
            do_domaine: [0],
            do_type: [6, 7]
        };
        const res2 = await axios.post('http://192.168.5.199:8000/api/referentiel/documents-entete', payload2);
        console.log("Response 2 Status:", res2.status);
    } catch (e) {
        console.log("Response 2 Error:", e.response ? e.response.status + " " + JSON.stringify(e.response.data) : e.message);
    }
}

testSchemaKeys();
