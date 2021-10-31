const jwt = require('jsonwebtoken');
const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const { response } = require('express');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.TOKEN);
            const userId = decodedToken.userId;
            let sqlInserts = [userId];
            let sql = 'SELECT * FROM user WHERE id=?';
            sql = mysql.format(sql, sqlInserts);
            console.log(sql);
            connectdb.query(sql, function(err, rows, fields){
                if (err) throw err;
                next();
            })
        } catch (error) {
            res.status(404).json({ error: message })
        }
    } else {
        res.status(401).json({ error: message })
    }
}; 