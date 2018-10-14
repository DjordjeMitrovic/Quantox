
const path = require('path');
const appDir = path.dirname(require.main.filename);
var dataBase = require(path.join(appDir, "/db/db.js"));
module.exports = class status {

    constructor() {
        this.db = new dataBase();

    }

    getAll(){
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


    


}