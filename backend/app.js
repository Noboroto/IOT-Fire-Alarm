const express = require("express")
const fs = require("fs")
const cors = require('cors');
const  axios = require ('axios');

const app = express();


const getDateFromString = (str) => new Date(str).toLocaleTimeString('en-UK', {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
});


app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/temperature', async (req, res) => {
    const { data: response } = await axios.get(`https://api.thingspeak.com/channels/2250106/fields/1.json?api_key=77GA6KJB9SQT46DZ&results=20`);
    
    const payload = response.feeds.map((obj) => {
        return {
            time: getDateFromString(obj["created_at"]),
            rate: Math.floor(Number(obj["field1"]))
        }
    })
    res.json(JSON.stringify(payload));
});

app.get('/stopReceive', () => {
    clearInterval(receiveMQTTInterval);
});

app.get('/valid', async (req, res) => {
    if (req.query.uname === "admin" && req.query.pass === "admin")
    {
        res.json(JSON.stringify({ accept: true }));
        return;
    }
    res.json(JSON.stringify({ accept: false }));
});

app.listen(4000, () => console.log('App listening on port 4000'));