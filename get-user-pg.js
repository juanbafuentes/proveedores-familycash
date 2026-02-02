const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:Zq0VhhQLn3NK6kVW8QCxL4kUOckidMBX8vh2LCyCUbsG90KEfCVhRML8IUaZU2dC@82.98.177.189:5460/postgres',
});

async function main() {
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM "LU_PRO" WHERE "PRO_PASSWD" IS NOT NULL AND "PRO_PASSWD" != \'\' LIMIT 1');
        if (res.rows.length > 0) {
            console.log("--- CREDENCIALES ---");
            console.log("NIF:", res.rows[0].QL_PRO_NIF);
            console.log("ID:", res.rows[0].ID_PRO);
            console.log("Pass:", res.rows[0].PRO_PASSWD);
        } else {
            console.log("No valid user found");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
