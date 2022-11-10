const mysql = require("mysql2");

require("dotenv").config()

//Connect to database
const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        port: 3306,
        password: "_EF10508315_",
        database: "management_db"
    },
    console.log("Connection to management_db Successful.")
);

connection.connect((err) => err ? err : null);

module.exports = connection;