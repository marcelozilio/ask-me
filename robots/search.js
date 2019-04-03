const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey


async function robot() {

    //await fetchContentFromWikipedia()
    teste()

    async function fetchContentFromWikipedia() {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe('Michel Temer')
        const wikipediaContent = wikipediaResponse.get()

        console.log(wikipediaContent.content)

    }


    function teste() {
        var Algorithmia = require("algorithmia");

        var input = {
            "articleName": "Michel Temer",
            "lang": "en"
        };
        Algorithmia.client("sim0NZsnKJ1X6XfFJ5dRfz+ai+N1")
            .algo("web/WikipediaParser/0.1.2") // timeout is optional
            .pipe(input)
            .then(function (response) {
                console.log(response.get());
            });
    }
}

module.exports = robot