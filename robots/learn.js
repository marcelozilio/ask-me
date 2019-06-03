const sentenceBoundaryDetection = require('sbd')

const watsonNluCredentials = require('../credentials/watson-nlu.json')
const watsonAssistCredentials = require('../credentials/watson-assistant.json')

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
const AssistantV1 = require('watson-developer-cloud/assistant/v1')

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonNluCredentials.apikey,
    version: '2018-04-05',
    url: watsonNluCredentials.url
})

const assistant = new AssistantV1({
    iam_apikey: watsonAssistCredentials.apikey,
    version: '2018-04-05',
    url: watsonAssistCredentials.url
})

const robots = {
    state: require('./state.js')
}

async function robot() {
    const content = robots.state.load()

    breakContentIntoSentences()
    fetchKeywordsOfAllSentences()
    await createEntity(getParamsEntity())

    content.output = {}
    content.output.text = content.sentences[0].text;
    robots.state.save(content)
   
    async function createEntity(params) {
        return new Promise((resolve, reject) => {
            assistant.createEntity(params)
                .then(res => { resolve(res) })
                .catch(err => { resolve(err) })
        })
    }

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

    function fetchNameEntity() {
        var a = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
        var name = ''
        for (var i = 0; i < 5; i++) {
            var rnum = Math.floor(Math.random() * a.length)
            name += a.substring(rnum, rnum + 1)
        }
        return name
    }

    function getParamsEntity() {
        const params = {
            workspace_id: watsonAssistCredentials.workspace_id,
            entity: fetchNameEntity(),
            values: content.sentences
        }
        return params
    }
}

module.exports = robot