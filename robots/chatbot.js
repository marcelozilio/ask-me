const sentenceBoundaryDetection = require('sbd')

const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')

const robots = {
    watson: require('./watson.js'),
    wikipedia: require('./wikipedia.js'),
    state: require('./state.js')
}

async function robot() {
    const content = robots.state.load()
    responseWatson = await robots.watson()
    content.output = {}

    if (responseWatson.entities.length === 0) {
        content.sourceWikipedia = await robots.wikipedia()
    } else {
        content.output.text = responseWatson.output.text[0];
    }
    robots.state.save(content)
}

module.exports = robot 