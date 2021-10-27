const mysql = require('mysql');
require('dotenv').config()

const connectdb = mysql.createConnection({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: groupomania_database
});

connectdb.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});