const watsonAssistantCredentials = require('../credentials/watson-assistant.json');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

const assistant = new AssistantV1({
    version: '2019-03-04',
    password: watsonAssistantCredentials.apikey,
    username: 'apikey'
});

function robot() {
    sendMessage()
}

function sendMessage() {
    assistant.message({
        workspace_id: watsonAssistantCredentials.workspace_id,
        input: { 'text': 'Boa noite' }
    }, function (err, response) {
        if (err) {
            console.log('error:', err);
        } else {
            console.log(response.output.text);
        }
    })
}

module.exports = robot