const express = require('express');
const path = require('path');
const axios = require('axios');
const redis = require('redis');

const app = express();
const port = 8000;
const cheerio = require('cheerio');
const redisClient = redis.createClient();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-wrestler-info', async (req, res) => {
    try {
        const wrestlerId = req.query.id;

        const wrestlerInfoFromCache = await redisClient.get(wrestlerId);
        if (wrestlerInfoFromCache) {
            console.log('Retrieving info from redis client.');
            return res.json(JSON.parse(wrestlerInfoFromCache));
        }
        const wrestlerProfileUrl = `https://www.sumo.or.jp/EnSumoDataRikishi/profile/${wrestlerId}/`;
        console.log('Retrieving info sumo.or.jp.')
        const response = await axios.get(wrestlerProfileUrl);
        const html = response.data;

        const $ = cheerio.load(html);
        const heightRow = $('table.mdTable2 tr th:contains("Height")').parent('tr');
        const heightValue = heightRow.find('td').text().trim();
        const weightRow = $('table.mdTable2 tr th:contains("Weight")').parent('tr');
        const weightValue = weightRow.find('td').text().trim();

        const imageSource = $('div.mdSection1 div.mdColSet1 img.col1').attr('src');

        const wrestlerInfo = { success: true, height: heightValue, weight: weightValue, imageSource: imageSource }
        await redisClient.set(wrestlerId, JSON.stringify(wrestlerInfo), {'EX': 3600})
        res.json(wrestlerInfo);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


const startup = async () => {
    try {
        await redisClient.connect();
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to Redis:', error.message);
        process.exit(1); // Exit the process with a non-zero status code
    }
}

startup();