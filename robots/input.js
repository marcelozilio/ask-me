const readline = require('readline-sync')

function robot() {
    return readline.question('Type here your question: ')
}

module.exports = robot