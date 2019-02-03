import AWS from 'aws-sdk';
import AttackHandler from './AttackHandler';
import SlackUnicornSender from './SlackUnicornSender';

const TABLE_NAME = process.env.TABLE_NAME
const ddbClient = new AWS.DynamoDB.DocumentClient({
    params: {
        TableName: TABLE_NAME
    }
});
const sender = new SlackUnicornSender();
const sesHanler = new AttackHandler(sender, ddbClient);


exports.handler = async (event) => {
    console.log(`Received event: ${JSON.stringify(event)}`);
    sesHanler.handle
};