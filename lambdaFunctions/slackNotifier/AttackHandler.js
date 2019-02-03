export default class AttackHandler {
    constructor(sender, ddbClient) {
        this.sender = sender;
        this.ddbClient = ddbClient;
    }

    handleAttack(attack) {

        this.sender.sendUnicorn({
            attacker: attack.attacker,
            victim: attack.victim,
            count: count,
            totalAttacks: totalAttacks,
            totalVictimizations: totalVictimizations
        })
    }
}