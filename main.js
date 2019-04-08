const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 3000;

const robots = {
    chatbot: require('./robots/chatbot.js'),
    state: require('./robots/state.js')
}

app.post('/conversation/', async (req, res) => {
    const content = req.body;

    robots.state.save(content)

    await robots.chatbot()

    res.json(robots.state.load())
});

app.listen(port, () => console.log(`Running on port ${port}`));