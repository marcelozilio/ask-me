const sentenceBoundaryDetection = require('sbd')

const watsonCredentials = require('../credentials/watson-nlu.json')
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonCredentials.apikey,
    version: '2018-04-05',
    url: watsonCredentials.url
})

const robots = {
    state: require('./state.js')
}

async function robot() {
    const content = robots.state.load()

    breakContentIntoSentences()
    fetchKeywordsOfAllSentences()

    robots.state.save(content)

    function breakContentIntoSentences() {
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceWikipedia)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
        content.sentences = content.sentences.slice(0, 5)
    }

    async function fetchKeywordsOfAllSentences() {
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }

    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: { keywords: {} }
            }, (error, response) => {
                if (error) {
                    throw error
                }
                const keywords = response.keywords.map((keyword) => {
                    return keyword.text
                })
                resolve(keywords)
            })
        })
    }

}

module.exports = robot