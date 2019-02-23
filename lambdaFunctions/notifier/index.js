
const ChimeUnicornSender = require('./ChimeUnicornSender');
const UnicornQueryService = require('./UnicornQueryService');
const AttackHandler = require('./AttackHandler');

console.log("Env: " + JSON.stringify(process.env, null, 2));
const TABLE_NAME = process.env.TABLE_NAME;
console.log("Table name is " + TABLE_NAME);
const HOOK_URL = process.env.CHIME_HOOK_URL;
console.log("Hook URL is " + HOOK_URL);

const sender = new ChimeUnicornSender({hookUrl: HOOK_URL});
const unicornService = new UnicornQueryService({tableName: TABLE_NAME});
const attackHandler = new AttackHandler({
    sender: sender,
    unicornService: unicornService
});

exports.handler = async (event) => {
    //console.log(`Received event: ${JSON.stringify(event)}`);
    return await attackHandler.handle(event);
};