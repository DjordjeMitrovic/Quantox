const path = require('path');
const appDir = path.dirname(require.main.filename);
var dataBase = require(path.join(appDir, "/db/db.js"));
module.exports = class tickets {

    constructor() {
        this.db = new dataBase();

    }
    getOne(id, role) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {
            var sql;
            if (role == "admin") {
                sql = "select * from tickets where id = ?";
            } else {
                sql = "select * from tickets where id = ? and archived = 0";
            }
            connection.connect();

            connection.query(sql, id,

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }

    getAll(role) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {
            var sql;
            if (role != "admin") {
                sql = "(select t.id,u2.username as 'assignedTo', title,content,u.username as 'creator', s.name as 'status' from tickets t left join status s on t.status=s.id left join users u on u.id=t.creator left join users u2 on u2.id = t.assignedTo where t.archived=0)";
            } else {
                sql = "(select t.id,t.archived, u2.username as 'assignedTo', title,content,u.username as 'creator', s.name as 'status' from tickets t left join status s on t.status=s.id left join users u on u.id=t.creator left join users u2 on u2.id = t.assignedTo)"
            }
            connection.connect();

            connection.query(sql, function (error, results) {
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

    update(ticket, role, userId, ticketId, newTicket) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {
            var sql;

            if (role == "admin") {
                sql = "update tickets set title=?, assignedTo = ?, content=?, status=?, archived=? where id = ?"
            } else {
                sql = "update tickets set title=?, assignedTo = ?, content=?, status=? where id = ?";
            }
            connection.connect();
            connection.query("select * from tickets where id = ?", ticketId, function (error, ticketResults) {
                if (error) {
                    console.log(error);
                }
                var oldTicket = ticketResults[0];

                var operation = "No Changes";

                if (!(oldTicket.title == newTicket.title && oldTicket.assignedTo == newTicket.assignedTo &&
                        oldTicket.content == newTicket.content)) {
                    if (operation == "No Changes") operation = "";
                    operation += "Property Changes";
                }
                if (oldTicket.status != newTicket.status) {
                    if (operation == "No Changes") operation = "";
                    else if (operation == "Property Changes") operation += ","
                    operation += " Status Changes "
                }
                connection.query("insert into activity(user, ticket, activity) values(?,?,?)", [userId, ticketId, operation], function (error, activityResults) {
                    if (error) {
                        console.log(error);
                    }
                    connection.query(sql, ticket,

                        function (error, results) {
                            if (error) {
                                console.log(error);
                            }
                            connection.end();

                            resolve(results);
                        });

                });



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

    deleteHard(id) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("delete from tickets where id = ?", id,

                function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    connection.end();

                    resolve(results);
                });

        });
    }

    getActivity(id) {
        var connection = this.db.getConnection();
        return new Promise(function (resolve, reject) {

            connection.connect();

            connection.query("select t.title, u.username, a.activity from activity a join users u on u.id = a.user join tickets t on t.id = a.ticket where t.id=?", id,

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