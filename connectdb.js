require('dotenv').config();
const mysql = require('mysql');

console.log('Connecting to database...');

let connectdb = mysql.createConnection({ 
    host: 'localhost', 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'groupmania_database'
});
connectdb.connect(function(err) { 
    if (err) throw err;
    console.log('Database connected!')
});

module.exports = connectdb;