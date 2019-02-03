const moment = require('moment-timezone');

const EMAIL_ADDRESS_PATTERN = /(?:.*=)?([a-zA-Z0-9!#$%&'*+-/?^_`{|}~]+)@([a-zA-Z0-9-.]+)/

class SesEventHandler {
    constructor(options) {
        this.persister = options.persister;
        this.trackingDomains = new Set(options.trackingDomains);
        this.testTrackingDomains = new Set(options.testTrackingDomains);
        this.victimDomainPrefix = options.victimDomainPrefix;
        this.timeZone = options.timeZone;
    }

    async handleEvent(sesEvent) {
        const email = new UnicornEmail(sesEvent.Records[0].ses);
        let validation = this.validateEmail(email);
        if(validation.valid) {
            const ts = moment(email.timestamp).tz(this.timeZone);
            const attacker = email.trackingAddress.local;
            const victim = email.victimAddress.local;
            await this.persister.persist({
                Attacker: attacker,
                Victim: victim,
                Pair: `${attacker}|${victim}`,
                Day: ts.format('YYYY-MM-DD'),
                Week: ts.startOf('week').format('YYYY-MM-DD'),
                Month: ts.format('YYYY-MM'),
                OriginalMessageId: email.emailMessageId,
                SesMessageId: email.sesMessageId,
                Subject: email.subject,
                Test: validation.isTest,
                Timestamp: email.timestamp
            });
            console.log("Persist complete");
        } else {
            console.log(`Dropping email: ${validation.reason}`);
        }
    }

    validateEmail(email) {
        const trackingAddressDomain = email.trackingAddress.domain;
        const isTest = this.testTrackingDomains.has(trackingAddressDomain);
        if(!(this.trackingDomains.has(trackingAddressDomain) || isTest)) {
            return {
                valid: false,
                reason: `Tracking domain, ${email.trackingAddress.domain}, is not valid. Expected one of ${Array.from(this.trackingDomains)}`
            }
        }
        if(!email.victimAddress.domain.startsWith(this.victimDomainPrefix)) {
            return {
                valid: false,
                reason: `Victim domain, ${email.victimAddress.domain}, does not start with ${this.victimDomainPrefix}`
            }
        }
        if(email.isReply()) {
            return {
                valid: false,
                reason: `email is a reply`
            }
        }
        return {valid: true, isTest: isTest};
    }
}

class UnicornEmail {
    constructor(sesNotification) {
        this.mail = sesNotification['mail']
        this.receipt = sesNotification['receipt']

        this.victimAddress = parseAddress(this.mail['source'])
        this.trackingAddress = parseAddress(this.receipt['recipients'][0])
        this.sesMessageId = this.mail['messageId']
        this.emailMessageId = this.mail['commonHeaders']['messageId']
        this.subject = this.mail['commonHeaders']['subject']
        this.timestamp = this.mail['timestamp']
    }

    isReply() {
        if(this.subject.toLowerCase().startsWith('re: ')) {
            return true;
        }

        let isReply = false;
        this.mail.headers.forEach(header => {
            if(header.name === 'In-Reply-To' || header.name === 'References') {
                isReply = true;
            }
        })

        return isReply;
    }
}

function parseAddress(addressString) {
    m = addressString.match(EMAIL_ADDRESS_PATTERN);
    if(m) {
        return {
            email: m[0],
            local: m[1],
            domain: m[2]
        }
    }
}

module.exports = SesEventHandler;