const AWS = require('aws-sdk');

class UnicornQueryService {
    constructor(options) {
        this.tableName = options.tableName;
        this.ddb = new AWS.DynamoDB.DocumentClient({
            params: { TableName: this.tableName }
        });
    }

    async getCount(attacker, victim) {
        let result = await this.ddb.query({
            IndexName: "Pair",
            KeyConditionExpression: "Pair = :v_pair",
            ExpressionAttributeValues: {
                ":v_pair": `${attacker}|${victim}`
            },
            Select: "COUNT"
        }).promise();

        return result.Count;
    }

    async getTotalAttacks(attacker) {
        let result = await this.ddb.query({
            IndexName: "Attacker",
            KeyConditionExpression: "Attacker = :v_attacker",
            ExpressionAttributeValues: {
                ":v_attacker": attacker
            },
            Select: "COUNT"
        }).promise();

        return result.Count;
    }

    async getTotalVictimizations(victim) {
        let result = await this.ddb.query({
            KeyConditionExpression: "Victim = :v_victim",
            ExpressionAttributeValues: {
                ":v_victim": victim
            },
            Select: "COUNT"
        }).promise();

        return result.Count;
    }
}

module.exports = UnicornQueryService;