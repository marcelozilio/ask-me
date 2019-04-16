const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apikey

const robots = {
    state: require('./state.js')
}

const searchError = 'Me desculpe, mas eu não entendi.';

async function robot() {
    const content = robots.state.load()
    content.sourceWikipedia = await getContentFromWikipedia()
    console.log(content.sourceWikipedia)
    robots.state.save(content);

    async function getContentFromWikipedia() {
        return new Promise((resolve, reject) => {
            algorithmia.client(algorithmiaApiKey)
                .algo('web/WikipediaParser/0.1.2')
                .pipe({ "articleName": content.input.text, "lang": "pt" })
                .then(function (response, error) {
                    if (response.error) {
                        resolve(sanitizeContent(searchError))
                    } else {
                        resolve(sanitizeContent(response.get().content))
                    }
                })
        })
    }

    function sanitizeContent(text) {
        if (text == searchError) {
            return text
        }
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