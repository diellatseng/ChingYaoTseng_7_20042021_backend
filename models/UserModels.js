const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserModels {
    register(sqlInserts) {
        let sql = 'INSERT INTO user (`full_name`, `email`, `password`) VALUES( ?, ?, ?)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) reject({ error: 'Register error!' });
                resolve({ message: 'New User created!' })
            })
        })
    };

    login(sqlInserts, password) {
        let sql = 'SELECT * FROM user WHERE email = ?';
        sql = mysql.format(sql, sqlInserts);

        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) reject({ err });
                if (!result[0]) {
                    reject({ error: 'User not found!' });
                } else {
                    bcrypt.compare(password, result[0].password) 
                        .then(valid => { 
                            console.log(result[0]);
                            if (!valid) return reject({ error: 'Password incorrect!' });
                            resolve({
                                userId: result[0].id,
                                token: jwt.sign(
                                    { userId: result[0].id },
                                    process.env.TOKEN,
                                    { expiresIn: '24h' } 
                                ),
                                role: result[0].role
                            });
                        })
                        .catch(error => reject({ error }));
                }
            })

        })
    };

    getOneUser(sqlInserts) {
        let sql = 'SELECT full_name, email, img_url, role FROM user WHERE id = ?';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) return reject({ error: 'User not found' });
                resolve(result);
            })
        })
    }
    
    deleteUser(sqlInserts) {
        let sql = 'DELETE FROM user WHERE id = ?';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) return reject({ error: 'Something went wrong.' });
                resolve(result);
            })
        })
    }
}

module.exports = UserModels;