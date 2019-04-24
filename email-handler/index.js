/**
 * This is a lambda function package for the SES inbound email handler. When an attacker unicorns a victim by sending an email to the tracking domain, SES will receive the email and then invoke this function.
 * 
 * This function's only job is to normalize the critical data elements of the email event and persist it to DynamoDB.
 */

const SesEventHandler = require('./SesEventHandler')
const SesDdbPersister = require('./SesDdbPersister')

const TABLE_NAME = process.env.TABLE_NAME
const VICTIM_DOMAIN_PREFIX = process.env.VICTIM_DOMAIN_PREFIX
const TRACKING_DOMAINS = process.env.TRACKING_DOMAINS
const TEST_TRACKING_DOMAINS = process.env.TEST_TRACKING_DOMAINS
const TIME_ZONE = process.env.TIME_ZONE

const persister = new SesDdbPersister({
    tableName: TABLE_NAME
});

const sesHandler = new SesEventHandler({
    persister: persister,
    trackingDomains: TRACKING_DOMAINS.split(','),
    testTrackingDomains: TEST_TRACKING_DOMAINS.split(','),
    victimDomainPrefix: VICTIM_DOMAIN_PREFIX,
    timeZone: TIME_ZONE
});

 exports.handler = async (event) => {
    //console.log(`Received event: ${JSON.stringify(event)}`);
    console.log("Start");
    return await sesHandler.handleEvent(event);
};