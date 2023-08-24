const express = require("express")
const cors = require('cors');
const axios = require ('axios');
const mqtt = require ('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com")

const DB_TEMP_WRITE = "https://api.thingspeak.com/update?api_key=WYTGIQ1IUL05USJA&field1="
const DB_TEMP_READ = "https://api.thingspeak.com/channels/2250106/fields/1.json?api_key=77GA6KJB9SQT46DZ&results=20"

const NOTICE_API = "https://maker.ifttt.com/trigger/emergency/with/key/RGl1gJEJt7lM8R9u7WVZE"

let flameStatus = 0
let gasStatus = 0
let isEmergency = 0
let tempArr = []

const updateTemp = () => {
    axios.get(DB_TEMP_READ)
        .then((response) => {
            tempArr = response.data.feeds.map((obj) => {
                return {
                    time: getDateFromString(obj["created_at"]),
                    rate: Number(obj["field1"])
                }
            })
        })
        .catch((err) => console.error(err));
}

const sendNotice = (sender) => {
    axios.post(NOTICE_API, {
        value1: sender
    })
}

updateTemp();

const app = express();
client.on("connect", () => {
    client.subscribe("21127469/emergency");
    client.subscribe("21127469/temperature");
    client.subscribe("21127469/gas");
    client.subscribe("21127469/flame");
});

client.on('message', (topic, message) => {
    console.log(`${topic} - ${message}`)
    switch(topic)
    {
        case "21127469/temperature":
            axios.get(`${DB_TEMP_WRITE}${Number(message)}`);
            updateTemp();
            break;
        case "21127469/gas":
            gasStatus = Number(message);
            break;
        case "21127469/flame":
            flameStatus = Number(message);
            break;
        case "21127469/emergency":
            isEmergency = Number(message);
            switch (isEmergency)
            {
                default:
                    break;
                case 1:
                    sendNotice("button");
                    break;
                case 2:
                    sendNotice("sensor");
                    break;
                case 3:
                    break;
            }
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
    // console.log("temp-fetch");
    res.json(JSON.stringify(tempArr));
});

app.get('/gas', async (req, res) => {
    // console.log(`gas ${gasStatus}`)
    res.json(gasStatus);
});

app.get('/flame', async (req, res) => {
    // console.log(`flame ${flameStatus}`)
    res.json(flameStatus);
});

app.get('/valid', async (req, res) => {
    if (req.query.uname === "admin" && req.query.pass === "admin")
    {
        res.json(JSON.stringify({ accept: true }));
        return;
    }
    res.json(JSON.stringify({ accept: false }));
});

app.get('/press_emergency', (req, res) => {
    client.publish("21127469/press_emergency", req.query.emergency.toString());
    console.log(`press_emergency ${req.query.emergency}`);
    if (req.query.emergency > 0)
    {
        sendNotice("user");
    }
    res.json(JSON.stringify({ accept: req.query.emergency > 0 }));
})

app.get('/emergency', async (req, res) => {
    res.json(isEmergency);
});

app.listen(4000, () => console.log('App listening on port 4000'));