'use strict';

const axios = require('axios');

class ChimeUnicornSender {
    constructor(options) {
        this.hookUrl = options.hookUrl;
    }

    async sendUnicornMessage(params) {
        let response = await axios.post(this.hookUrl, {
            //Content: `:rotating_light:🦄:rotating_light:🦄:rotating_light:🦄:rotating_light:🦄:rotating_light:🦄:rotating_light:\n${params.victim}@ has left their laptop unlocked creating a security risk!\nThis is the ${toOrdinal(params.totalVictimizations)} time they have professed their love of unicorns.\n\nThanks to ${params.attacker}@. This is their ${toOrdinal(params.totalAttacks)} unicorn report all time.`
            Content: `:rotating_light:🦄:rotating_light:🦄:rotating_light:🦄:rotating_light:🦄:rotating_light:🦄:rotating_light:\n${params.attacker} just got ${params.victim} (the ${toOrdinal(params.count)} time this has happened.)\n\nTotal unicorns by ${params.attacker}: ${params.totalAttacks}\nTotal against ${params.victim}: ${params.totalVictimizations}`
        });
        if(response.status !== 200) {
            console.error("Error sending message to Chime");
            console.error(response);
        }
    }
}

function toOrdinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

module.exports = ChimeUnicornSender;