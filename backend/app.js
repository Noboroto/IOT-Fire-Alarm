const express = require("express")
const fs = require("fs")
const cors = require('cors');

const DATA_LIMIT = 20;
const TEMP_DATA_PATH = "./data.json";
const app = express();
const readMinutesStep = 1;

const getCurrentTime = () => new Date().toLocaleTimeString('en-US', {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

const receiveMQTT = () => {
    const tempData = JSON.parse(fs.readFileSync(TEMP_DATA_PATH));

    if (tempData.length == 0)
    {
        tempData.push(
            {
                "time": getCurrentTime().toString(),
                "rate": Math.floor(Math.random() * (40 - 20) + 20)
            }
        )
        fs.writeFileSync(TEMP_DATA_PATH, JSON.stringify(tempData))
        return;
    }

    const lastItem = tempData[tempData.length - 1];
    if ( lastItem["time"] != getCurrentTime().toString() && tempData.length >= DATA_LIMIT) {
        tempData.shift();
    }
    tempData.push(
        {
            "time": getCurrentTime().toString(),
            "rate": Math.floor(Math.random() * (40 - 20) + 20)
        }
    )
    fs.writeFileSync(TEMP_DATA_PATH, JSON.stringify(tempData))
}

var receiveMQTTInterval = setInterval(receiveMQTT, Number(readMinutesStep * 60000));
fs.writeFileSync(TEMP_DATA_PATH, "[]");

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/temperature', (req, res) => {
    receiveMQTT();
    console.log("/temperature");
    res.json(fs.readFileSync(TEMP_DATA_PATH, { encoding: "utf-8" }));
});

app.get('/stopReceive', function () {
    clearInterval(receiveMQTTInterval);
});

app.listen(4000, () => console.log('App listening on port 4000'));