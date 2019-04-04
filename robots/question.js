const watsonAssistantCredentials = require('../credentials/watson-assistant.json');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

const assistant = new AssistantV1({
    version: '2019-03-04',
    password: watsonAssistantCredentials.apikey,
    username: 'apikey'
});

async function robot(question) {
    return new Promise((resolve, reject) => {
        assistant.message({
            workspace_id: watsonAssistantCredentials.workspace_id,
            input: { 'text': question }
        }, function (err, response) {
            if (err) {
                resolve(err);
            } else {
                resolve(response);
            }
        })
    })
}

module.exports = robot