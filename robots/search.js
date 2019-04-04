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
                    resolve(sanitizeContent(response.get().content))
                })
        })
    }

    function sanitizeContent(text) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(text)
        return removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }

        function removeDatesInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
        }
    }
}

module.exports = robot 