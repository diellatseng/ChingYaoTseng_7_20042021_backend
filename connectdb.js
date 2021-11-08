require('dotenv').config();
const mysql = require('mysql');

console.log('Connecting to database...');

let connectdb = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'groupomania_db'
});
connectdb.connect(function (err) {
    if (err) console.log(err);
    console.log('Database connected!')
});

module.exports = connectdb;