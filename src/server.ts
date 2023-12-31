import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { default as axios } from 'axios';
import * as redis from 'redis';
import * as cheerio from 'cheerio';
import { sumoWrestlers } from '../public/data.js';

const app = express();
const port = 8000;


const url = process.env.REDIS_URL || 'redis://sumo-redis:6379';
const redisClient = redis.createClient({
    url
});

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



app.use(express.static(path.join(__dirname, '/../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public', 'index.html'));
});

app.get('/banzuke', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public', 'banzuke.html'));
});

app.get('/compare', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public', 'compare.html'));
});


const getWrestlerInfoFromSumoAssociation = async (wrestlerId: string) => {
    const wrestlerProfileUrl = `https://www.sumo.or.jp/EnSumoDataRikishi/profile/${wrestlerId}/`;
    console.log(`Retrieving ${wrestlerId} info from sumo.or.jp.`)
    const response = await axios.get(wrestlerProfileUrl);
    const html = response.data;

    const $ = cheerio.load(html);
    const heightRow = $('table.mdTable2 tr th:contains("Height")').parent('tr');
    const heightValue = heightRow.find('td').text().trim();
    const weightRow = $('table.mdTable2 tr th:contains("Weight")').parent('tr');
    const weightValue = weightRow.find('td').text().trim();

    const imageSource = $('div.mdSection1 div.mdColSet1 img.col1').attr('src');
    const wrestlerInfo = { success: true, height: heightValue, weight: weightValue, imageSource: imageSource }
    return wrestlerInfo;
}

app.get('/get-wrestler-info', async (req, res) => {
    try {
        const wrestlerId = req.query.id as string;

        const wrestlerInfoFromCache = await redisClient.get(wrestlerId);
        if (wrestlerInfoFromCache) {
            console.log('Retrieving info from redis client.');
            return res.json(JSON.parse(wrestlerInfoFromCache));
        }

        const wrestlerInfo = await getWrestlerInfoFromSumoAssociation(wrestlerId);

        await redisClient.set(wrestlerId, JSON.stringify(wrestlerInfo), { 'EX': 600 })
        res.json(wrestlerInfo);
    } catch (error: any) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


const startup = async () => {
    try {
        await redisClient.connect();

        await Promise.all(
            sumoWrestlers.map(async (sumoWrestler) => {
                const wrestlerId = sumoWrestler.sumoKyoukaiId.toString();
                const wrestlerInfo = await getWrestlerInfoFromSumoAssociation(wrestlerId);
                await redisClient.set(wrestlerId.toString(), JSON.stringify(wrestlerInfo), { 'EX': 600 });
            })
        );

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error connecting to Redis:', error.message);
        }
        process.exit(1);
    }
}

startup();