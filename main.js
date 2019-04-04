const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 3000;

const robots = {
    chatbot: require('./robots/chatbot.js')
}

app.post('/conversation/', async (req, res) => {
    res.json(await robots.chatbot(req.body.text))
});

app.listen(port, () => console.log(`Running on port ${port}`));