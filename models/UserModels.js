const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class UserModels {
    constructor() {
    }

    // Functions using traditional way to query database
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
                            if (!valid) return reject({ error: 'Password incorrect!' });
                            resolve({
                                userId: result[0].id,
                                token: jwt.sign(
                                    { userId: result[0].id },
                                    process.env.TOKEN,
                                    { expiresIn: '24h' } 
                                )
                            });
                        })
                        .catch(error => reject({ error }));
                }
            })

        })
    };

    // Functions using prisma to query database
    async getOneUser(sqlInserts) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: sqlInserts,
                },
            })
            return user;
        } catch (error) {
            throw error;
        }
    }
    
    async deleteUser(sqlInserts) {
        try {
            const deleteUser = await prisma.user.delete({
                where: {
                    id: sqlInserts,
                },
            })
            console.log(deleteUser);
            return deleteUser;
        } catch (error) {
            throw error;
        }
    }
    // updateUser(sqlInserts){
    //     let sql = 'UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?';
    //     sql = mysql.format(sql,sqlInserts);
    //     return new Promise((resolve, reject) =>{
    //         connectdb.query(sql, function(err, result){
    //             if (err) return reject({error : 'fonction indisponible'});
    //             resolve({message : 'Informations mises à jour !'});
    //         }) 

    //     })
    // }
}

module.exports = UserModels;