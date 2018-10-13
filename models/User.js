var sha1 = require('sha1');
const path = require('path');
const appDir = path.dirname(require.main.filename);
var dataBase = require(path.join(appDir, "/db/db.js"));
module.exports = class users {

    constructor() {
        this.db = new dataBase();

    }

    checkIfUserExists(username, password) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();
            console.log("a");
            connection.query("select * from users where username = ? and password=?",
                [username, sha1(password)],
                function (error, results) {
                    connection.end();
                    console.log("b");
                    resolve(results.length > 0);
                });

        });



    }


} 