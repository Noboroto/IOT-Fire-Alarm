const express = require("express")
const fs = require("fs")
const cors = require('cors');
const axios = require ('axios');
const mqtt = require ('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com")

const DB_TEMP_WRITE = "https://api.thingspeak.com/update?api_key=WYTGIQ1IUL05USJA&field1="
const DB_TEMP_READ = "https://api.thingspeak.com/channels/2250106/fields/1.json?api_key=77GA6KJB9SQT46DZ&results=20"

const DB_GAS_WRITE = "https://api.thingspeak.com/update?api_key=WYTGIQ1IUL05USJA&field2="
const DB_GAS_READ = "https://api.thingspeak.com/channels/2250106/fields/2.json?api_key=77GA6KJB9SQT46DZ&results=1"

const DB_FLAME_WRITE = "https://api.thingspeak.com/update?api_key=WYTGIQ1IUL05USJA&field3="
const DB_FLAME_READ = "https://api.thingspeak.com/channels/2250106/fields/3.json?api_key=77GA6KJB9SQT46DZ&results=1"

const app = express();
client.on("connect", () => {
    client.subscribe("21127469/emergency");
    client.subscribe("21127469/temperature");
    client.subscribe("21127469/gas");
    client.subscribe("21127469/flame");
});

client.on('message', (topic, message) => {
    switch(topic)
    {
        case "21127469/temperature":
            axios.get(`${DB_TEMP_WRITE}${Number(message)}`);
            break;
        case "21127469/gas":
            axios.get(`${DB_GAS_WRITE}${Number(message)}`);
            break;
        case "21127469/flame":
            axios.get(`${DB_FLAME_WRITE}${Number(message)}`);
            break;
    }
})

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
    const { data: response } = await axios.get(DB_TEMP_READ);
    
    const payload = response.feeds.map((obj) => {
        return {
            time: getDateFromString(obj["created_at"]),
            rate: Math.floor(Number(obj["field1"]))
        }
    })
    res.json(JSON.stringify(payload));
});

app.get('/gas', async (req, res) => {
    const { data: response } = await axios.get(DB_GAS_READ);

    const payload = Math.floor(Number(response.feeds[0]["field2"]))
    res.json(payload);
});

app.get('/flame', async (req, res) => {
    const { data: response } = await axios.get(DB_FLAME_READ);

    const payload = Math.floor(Number(response.feeds[0]["field3"]))
    res.json(payload);
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