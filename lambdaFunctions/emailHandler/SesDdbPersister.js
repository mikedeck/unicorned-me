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
        console.log("Starting persist");
        let result;
        try {
            result = await this.ddb.put({
                Item: email
            }).promise();
            console.log("DDB write complete");
        } catch(err) {
            console.err("Error writting to DDB", err);
        }
        console.log(result);
    }
}

module.exports = SesDdbPersister;