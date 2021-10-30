const jwt = require('jsonwebtoken');
const connectdb = require('../connectdb.js');
const mysql = require('mysql');

module.exports = (req, res, next) => {
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
        res.status(401).json({error: error})
    }
}; 