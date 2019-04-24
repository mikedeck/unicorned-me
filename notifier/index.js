const ChimeUnicornSender = require('./ChimeUnicornSender');
const AttackHandler = require('./AttackHandler');

const TABLE_NAME = process.env.TABLE_NAME;
const HOOK_URL = process.env.CHIME_HOOK_URL;

const sender = new ChimeUnicornSender({hookUrl: HOOK_URL});
const attackHandler = new AttackHandler({
    sender: sender,
    unicornTable: TABLE_NAME
});

exports.handler = async (event) => {
    console.log(`Received event: ${JSON.stringify(event)}`);
    return await attackHandler.handle(event);
};