const robots = {
    question: require('./question.js'),
    search: require('./search.js')
}

async function robot(message) {
    responseQuestion = await robots.question(message)
    return await chatbot()
    
    async function chatbot() {
        return new Promise((resolve, reject) => {
            if (responseQuestion.entities.length === 0) {
                resolve(robots.search(message))
            } else {
                resolve(responseQuestion.output.text[0])
            }
        })
    }
}

module.exports = robot 