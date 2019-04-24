const assert = require('assert');
const sinon = require('sinon');
const generateTestSuite = require('test-generator');
const SesEventHandler = require('../../SesEventHandler');

const persister = sinon.spy();
const handler = new SesEventHandler({
    persister: { persist: persister},
    trackingDomains: [
        "trackingdomain.com",
        "trackingdomain2.com"
    ],
    testTrackingDomains: [
        "test.trackingdomain.com",
        "test.trackingdomain2.com"
    ],
    victimDomainPrefix: "example",
    timeZone: 'America/Los_Angeles'
});

beforeEach(function() {
    persister.resetHistory();
});

function verifyHandleEmail(testData) {
    handler.handleEvent(testData.event);
    if(testData.ddbItem === 'DO_NOT_TRACK') {
        sinon.assert.notCalled(persister);
    } else {
        sinon.assert.calledWith(persister, testData.ddbItem);
    }
}

describe('Email Handler', function() {
    generateTestSuite(this.file, verifyHandleEmail);
});
