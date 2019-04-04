const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apikey

async function robot(question) {
    return await getContentFromWikipedia(question)
    
    async function getContentFromWikipedia(question) {
        return new Promise((resolve, reject) => {
            algorithmia.client(algorithmiaApiKey)
                .algo('web/WikipediaParser/0.1.2')
                .pipe({ "articleName": question, "lang": "pt" })
                .then(function (response) {
                    resolve(response.get().content)
                })
        })
    }
}

module.exports = robot 