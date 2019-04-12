const robots = {
    watson: require('./watson.js'),
    wikipedia: require('./wikipedia.js'),
    state: require('./state.js'),
    learn: require('./learn.js')
}

async function robot() {
    responseWatson = await robots.watson()

    if (responseWatson.entities.length === 0) {
        await robots.wikipedia()
        await robots.learn()
        finalState(1);
    } else {
        finalState(responseWatson.output.text[0]);
    }

    function finalState(output) {
        const response = robots.state.load()
        response.output = {};
        response.output.text = output
        robots.state.save(response)
    }

}

module.exports = robot