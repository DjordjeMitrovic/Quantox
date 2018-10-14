const path = require('path');
const appDir = path.dirname(require.main.filename);
var dataBase = require(path.join(appDir, "/db/db.js"));
module.exports = class tickets {

    constructor() {
        this.db = new dataBase();

    }
    getOne(id) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("select * from tickets where id = ? and archived=0", id,

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }

    getAll() {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("(select t.id,u2.username as 'assignedTo', title,content,u.username as 'creator', s.name as 'status' from tickets t left join status s on t.status=s.id left join users u on u.id=t.creator left join users u2 on u2.id = t.assignedTo where t.archived=0) ",

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }

    insert(ticket) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("insert into tickets(title,assignedTo,content,creator,status) values(?, ?, ?, ?, ?)", ticket,

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });

    }

    update(ticket) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("update tickets set title=?, assignedTo = ?, content=?, status=? where id = ?", ticket,

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

            connection.query("update tickets set archived=1  where id = ?", id,

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