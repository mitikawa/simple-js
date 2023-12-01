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

type BanzukeRowInfo = {
    name: string;
    rank: string;
    side: string;
    position: number;
}

const getCurrentBanzuke = async () => {
    const banzukeUrl = 'https://sumodb.sumogames.de/Banzuke.aspx';
    console.log(`Retrieving banzuke info from sumodb.sumogames.de.`)
    const response = await axios.get(banzukeUrl);
    const html = response.data;
    
    const $ = cheerio.load(html);

    const makuuchiTable = $('table.banzuke:has(caption:contains("Makuuchi Banzuke"))');

    const eastList: (BanzukeRowInfo | null)[] = [];
    const westList: (BanzukeRowInfo | null)[] = [];

    var previousRank: string | null = null;
    var position: number = 1;

    // Iterate through each row in the tbody
    makuuchiTable.find('tbody tr').each((index, row) => {
        const $row = $(row);

        const rowLength: number = $row.find('td').length;

        let westWrestlerName: string | null;
        let eastWrestlerName: string | null;

        // Only has west
        if (rowLength == 4) {
            if ($row.find('td').eq(0).hasClass('emptycell')) {
                // Only has west wrestler [empty, rank, wrestler, record]
                eastWrestlerName = null;
                if ($row.find('td.shikona').length === 1){
                    westWrestlerName = $row.find('td.shikona').text().trim();
                } else {
                    if ($row.find('td.debut').length === 1) {
                        westWrestlerName = $row.find('td.debut').text().trim();
                    } else {
                        throw new Error("No shikona or debut found.");
                    }
                } 
            } else {
                // Only has east wrestler [wrestler, record, rank, empty]
                if ($row.find('td.shikona').length === 1){
                    eastWrestlerName = $row.find('td.shikona').text().trim();
                } else {
                    if ($row.find('td.debut').length === 1) {
                        eastWrestlerName = $row.find('td.debut').text().trim();
                    } else {
                        throw new Error("No shikona or debut found.");
                    }
                } 
                westWrestlerName = null;
            }
        } else {
            // has both wrestlers [record,wrestler,rank,wrestler,record]
            eastWrestlerName = $row.find('td').eq(1).text().trim();
            westWrestlerName = $row.find('td').eq(3).text().trim();        
        }

        // Find the short_rank cell in the current row
        const shortRankCell = $row.find('td.short_rank');
        if (shortRankCell.length > 0) {
            const rank = shortRankCell.text().trim();
            if (rank === previousRank) {
                position += 1;
            } else {
                position = 1;
            }

            if (eastWrestlerName) {
                const eastRowInfo : BanzukeRowInfo = {"name": eastWrestlerName, "rank": rank, "position": position, "side": "E"};
                eastList.push(eastRowInfo);
            } else {
                const eastRowInfo : BanzukeRowInfo = {"name": "", "rank": rank, "position": position, "side": "E"};
                eastList.push(eastRowInfo);
            }

            if (westWrestlerName) {
                const westRowInfo : BanzukeRowInfo = {"name": westWrestlerName, "rank": rank, "position": position, "side": "W"};
                westList.push(westRowInfo);
            } else {
                const westRowInfo : BanzukeRowInfo = {"name": "", "rank": rank, "position": position, "side": "W"};
                westList.push(westRowInfo);
            }

            previousRank = rank;
        }
    })
    return {"eastList": eastList, "westList": westList};
}

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

app.get('/get-banzuke-info', async (_, res) => {
    try {
        const banzukeFromCache = await redisClient.get('banzuke');
        if (banzukeFromCache) {
            console.log('Retrieving banzuke info from redis client.');
            return res.json(JSON.parse(banzukeFromCache));
        }

        const banzuke = await getCurrentBanzuke();

        await redisClient.set('banzuke', JSON.stringify(banzuke), { 'EX': 600 })
        res.json(banzuke);
    } catch (error: any) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

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

        const banzuke = await getCurrentBanzuke();
        await redisClient.set('banzuke', JSON.stringify(banzuke), { 'EX': 600 });

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