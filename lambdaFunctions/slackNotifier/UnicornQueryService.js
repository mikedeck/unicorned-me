const AWS = require('aws-sdk');

class UnicornQueryService {
    constructor(options) {
        this.tableName = options.tableName;
        this.ddb = new AWS.DynamoDB.DocumentClient({
            params: { TableName: this.tableName }
        });
    }

    getCount(attacker, victim) {
        this.ddbClient.query({
            Index: "Pair",
            KeyConditionExpression: "Pair = :v_pair",
            ExpressionAttributeValues: {
                ":v_pair": `${attacker}|${victim}`
            }
        })
    }

    getTotalAttacks(attacker) {

    }

    getTotalVictimizations(victim) {

    }
}