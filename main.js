const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

const port = 3000;

const robots = {
    chatbot: require('./robots/chatbot.js'),
    state: require('./robots/state.js')
}

app.post('/conversation/', async (req, res) => {
    const content = req.body;

    if (content != null
        && content.input != null
        && content.input.text != null) {
        robots.state.save(content)
        await robots.chatbot()
    }
    res.json(robots.state.load())

});

app.listen(port, () => console.log(`Running on port ${port}`));