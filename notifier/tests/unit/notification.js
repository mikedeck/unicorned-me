const fs = require('fs');
const path = require('path');
const envFile = path.join(__dirname, '../../../devenv.json');
const env = JSON.parse(fs.readFileSync(envFile, 'utf8'));

const AWS = require('aws-sdk');

AWS.config.update({region: env.Region});

const generateTestSuite = require('test-generator');
const nock = require('nock');

const AttackHandler = require('../../AttackHandler');
const ChimeUnicornSender = require('../../ChimeUnicornSender');

const DUMMY_ENDPOINT = 'https://test.chime.endpoint';
const HOOK_PATH = '/hook';
const HOOK_URL = DUMMY_ENDPOINT + HOOK_PATH;

const sender = new ChimeUnicornSender({hookUrl: HOOK_URL});
const attackHandler = new AttackHandler({
    sender: sender,
    unicornTable: env.TableName
});

function verifyNotification(testData) {
    const scope = nock(DUMMY_ENDPOINT)
        .post(HOOK_PATH, {Content: testData.webhookContent})
        .reply(200, JSON.stringify({
            MessageId: "messageId",
            RoomId: "roomId"
        }));
    
    return attackHandler.handle(testData.event)
        .then(() => {
            scope.done();
        });
}

describe('Chime Notification', function() {
    this.timeout(10000);
    generateTestSuite(this.file, verifyNotification);
});