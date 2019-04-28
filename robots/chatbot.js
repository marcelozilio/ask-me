const robots = {
    watson: require('./watson.js'),
    wikipedia: require('./wikipedia.js'),
    state: require('./state.js'),
    learn: require('./learn.js')
}

async function robot() {
    responseWatson = await robots.watson()

    if (responseWatson.output.text == 'error') {
        await robots.wikipedia()
        await robots.learn()
        const content = robots.state.load();
        finalState(content.output.text)   
    } else {
        finalState(responseWatson.output.text[0])
    }

    function finalState(output) {
        const response = robots.state.load()
        response.output = {};
        response.output.text = output
        robots.state.save(response)
    }
}

module.exports = robot