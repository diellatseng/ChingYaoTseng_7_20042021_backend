const jwt = require('jsonwebtoken');
const connectdb = require('../connectdb.js');
const mysql = require('mysql');

module.exports = (req, res, next) => {
    console.log('Auth: req.body -> ' + req.body);
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.TOKEN);
            const userId = decodedToken.userId;
            let sqlInserts = [userId];
            let sql = 'SELECT * FROM user WHERE id=?';
            sql = mysql.format(sql, sqlInserts);
            connectdb.query(sql, function (err, rows, fields) {
                if (err) console.log('Oops... somthing went wrong.');
                next();
            })
        } catch (error) {
            res.status(401).json({ message: 'Error! Unauthorized.' })
        }
    } else {
        res.status(401).json({ message: 'Error! Not logged in' })
    }
};