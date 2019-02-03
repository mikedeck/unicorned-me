const AWS = require('aws-sdk');

class SesDdbPersister {
    constructor(options) {
        const tableName = options.tableName;
        this.ddb = new AWS.DynamoDB.DocumentClient({
            params: {
                TableName: tableName
            }
        });
    }

    async persist(email) {
        let result;
        try {
            result = await this.ddb.put({
                Item: email
            }).promise();
        } catch(err) {
            console.err("Error writting to DDB", err);
        }
        console.log(result);
    }
}

module.exports = SesDdbPersister;