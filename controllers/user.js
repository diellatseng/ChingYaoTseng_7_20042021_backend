const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const connectdb = require('../connectdb.js');

const UserModels = require ('../Models/UserModels.js')
let userModels = new UserModels();

exports.signup = (req, res, next) => {
	let full_name = req.body.full_name;
    let email = req.body.email;
	let password = req.body.password;
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,255}$/.test(req.body.password)) {
        bcrypt.hash(password, 10)
            .then (hash => {
                let sqlInserts = [full_name, email, hash];   
                userModels.signup(sqlInserts)
                    .then((response) =>{
                        res.status(201).json(JSON.stringify(response))
                    })
                    .catch((error) =>{
                        console.error(error);
                        res.status(400).json({error})
                    })
            })
            .catch(error => res.status(500).json(error)) 
    } else {
        res.status(400).json({ message: 'Error! Passwords must be at least 8 characters in length. It should contain at least one upper case English letter, one lower case English letter, one number and one special character.' })
    }
};

// exports.login = (req, res) => {
//     User.findOne({ email: req.body.email })
//         .then(user => {
//             if (!user) {
//                 return res.status(401).json({ error: 'User not found!' });
//             }
//             bcrypt.compare(req.body.password, user.password)
//                 .then(valid => {
//                     if (!valid) {
//                         return res.status(401).json({ error: 'Password incorrect!' });
//                     }
//                     res.status(200).json({
//                         userId: user._id,
//                         token: jwt.sign(
//                             { userId: user._id },
//                             process.env.TOKEN,
//                             { expiresIn: '24h' }
//                         )
//                     });
//                 })
//                 .catch(error => res.status(500).json({ message: error.message }));
//         })
//         .catch(error => res.status(500).json({ message: error.message }));
// };