const jwt = require('jsonwebtoken');
const connectdb = require('../connectdb.js');
const mysql = require('mysql');

module.exports = (req, res, next) => {
        console.log(req.headers);
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        let sqlInserts = [userId];
        let sql = 'SELECT COUNT(id) FROM users WHERE id=?';
        sql = mysql.format(sql, sqlInserts); 
        connectdb.query(sql, function(err, result){
            if (err) reject({error : 'Error!'});
            if (result[0]['COUNT(id)'] !== 1) {
                throw 'Invalid User ID';
            } else {
                next();
            }
        })
    } catch (error) {
        res.status(401).json({error: error})
    }
}; 