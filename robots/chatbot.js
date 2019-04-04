
const robots = {
    question: require('./question.js'),
    search: require('./search.js')
}

async function robot(message) {
    responseQuestion = await robots.question(message)
    
    return await teste()
    
    async function teste() {
        return new Promise((resolve, reject) => {
            if (responseQuestion.entities == 0) {
                resolve(robots.search(message))
            } else {
                resolve(responseQuestion.output.text[0])
            }
        })
    }
}

module.exports = robot 