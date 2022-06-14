const sqliteConnection = require("../../sqlite");

const AppError = require("../../../utils/AppError")

const createUsers = require("./createUsers");

async function migrationsRun() {
    const schema = [
        createUsers
    ].join('');

    sqliteConnection()
    .then(db => db.exec(schema))
    .catch(error => {
        throw new AppError(error.message)
    })
}

module.exports = migrationsRun;