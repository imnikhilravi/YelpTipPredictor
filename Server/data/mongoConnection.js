const MongoClient = require("mongodb").MongoClient;

let dbConnectionVariables = {
    "serverUrl": "mongodb://localhost:27017/",
    "database": "what_to_eat_db"
}

let fullMongoUrl = `${dbConnectionVariables.serverUrl}${dbConnectionVariables.database}`;
let _connection = undefined;

module.exports = {
    dbConnection: async function dbConnection() {
        if (!_connection)
            _connection = await MongoClient.connect(dbConnectionVariables.serverUrl);
        return _connection.db(dbConnectionVariables.database);
    }
}