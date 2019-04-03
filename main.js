const robots = {
    text: require('./robots/text.js'),
    input: require('./robots/input.js'),
    search: require('./robots/search.js')
}

function start() {
    // robots.input()
    robots.search()
    // robots.text()
}

start()