require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('./db');
const { getStatistics } = require('./controllers/statisticsController');

async function test() {
    const req = {};
    const res = {
        json: (data) => console.log(JSON.stringify(data, null, 2)),
        status: (code) => ({
            json: (data) => console.log(`Error ${code}:`, data)
        })
    };
    await getStatistics(req, res);
    pool.end();
}
test();
