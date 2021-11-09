require('dotenv').config();
const mysql = require('mysql');

console.log('Connecting to database...');

let connectdb = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'groupomania_db',
    // mysql npm added time zone offset automatically after fetching time from database
    // when working locally it might cause a problem where time is not correctely displayed
    // by adding timezone: 'utc' OR 'local' OR 'Z' will fix this problem
    timezone: 'utc'
});
connectdb.connect(function (err) {
    if (err) console.log(err);
    console.log('Database connected!')
});

module.exports = connectdb;