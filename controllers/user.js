const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const connectdb = require('../connectdb.js');

const UserModels = require('../Models/UserModels.js')
let userModels = new UserModels();

exports.register = (req, res, next) => {
    let full_name = req.body.full_name;
    let email = req.body.email;
    let password = req.body.password;
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,255}$/.test(req.body.password)) {
        bcrypt.hash(password, 10)
            .then(hash => {
                let sqlInserts = [full_name, email, hash];
                userModels.register(sqlInserts)
                    .then((response) => {
                        res.status(201).json(JSON.stringify(response))
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(400).json({ error })
                    })
            })
            .catch(error => res.status(500).json(error))
    } else {
        res.status(400).json({ message: 'Error! Passwords must be at least 8 characters in length. It should contain at least one upper case English letter, one lower case English letter, one number and one special character.' })
    }
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let sqlInserts = [email];
    userModels.login(sqlInserts, password)
        .then((response) => {
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) => {
            res.status(400).json(error)
        })
}

exports.getOneUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    let sqlInserts = userId;
    userModels.getOneUser(sqlInserts)
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json(error)
        })
}

// exports.getOneUser = (req, res) => {
//     const user = await prisma.user.findUnique({
//         where: {
//             email: 'elsa@prisma.io',
//         },
//     });
//     console.log(user);
// }