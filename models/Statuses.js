const path = require('path');
const appDir = path.dirname(require.main.filename);
var dataBase = require(path.join(appDir, "/db/db.js"));
module.exports = class status {

    constructor() {
        this.db = new dataBase();

    }

    getAll() {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("select * from status",
                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }
    getOne(id) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("select * from status where id = ?",id ,
                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }
    add(name, creator) {

        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("insert into status(name, createdBy) values(?, ?)", [name, creator],
                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });

    }

    delete(id) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("delete from status where id = ?", id,
                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }

    update(id,user,name) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("update status set createdBy = ?, name = ? where id = ?", [user,name,id],
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