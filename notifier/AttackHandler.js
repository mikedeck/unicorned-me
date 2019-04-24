const UnicornQueryService = require ('./UnicornQueryService');

class AttackHandler {
    constructor(options) {
        this.sender = options.sender;
        this.unicornService = new UnicornQueryService({tableName: options.unicornTable});;
    }

    handle(event) {
        let promises = [];
        let self = this;
        event.Records.forEach(record => {
            promises.push(self.handleAttack({
                attacker: record.dynamodb.NewImage.Attacker.S,
                victim: record.dynamodb.Keys.Victim.S
            }));
        });
        return Promise.all(promises);
    }

    async handleAttack(attack) {
        console.log("Handling attack: " + JSON.stringify(attack));
        let count = await this.unicornService.getCount(attack.attacker, attack.victim);
        let totalAttacks = await this.unicornService.getTotalAttacks(attack.attacker);
        let totalVictimizations = await this.unicornService.getTotalVictimizations(attack.victim);

        console.log("Sending unicorn");
        return await this.sender.sendUnicornMessage({
            attacker: attack.attacker,
            victim: attack.victim,
            count: count,
            totalAttacks: totalAttacks,
            totalVictimizations: totalVictimizations
        });
    }
}

module.exports = AttackHandler;