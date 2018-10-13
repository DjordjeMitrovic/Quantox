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

            connection.query("select * from users where username = ? and password=?",
                [username, sha1(password)],
                function (error, results) {
                    connection.end();

                    resolve(results);
                });

        });



    }

    checkIfUnique(username, email) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("select * from users where username = ? or email=?",
                [username, email],
                function (error, results) {
                    connection.end();

                    resolve(results);
                });

        });
    }

    insert(user) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("insert into users(firstName,lastName,username,password,email) values(?, ?, ?, ?, ?)", user,

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });



    }

    auth(username) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("update users set `activated` =  1 where username = ?", username,

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });


    }


}