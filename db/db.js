const mysql = require('mysql');
const settings = require("./settings.js");
module.exports = class db {

        constructor() {
         

        }

        getConnection() {
            var connection = mysql.createConnection(settings);
              return connection;


            }
        } 