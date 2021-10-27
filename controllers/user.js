const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// exports.signup = (req, res) => {
//     if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(req.body.password)) {
//         bcrypt.hash(req.body.password, 10)
//             .then(hash => {
//                 const user = new User({
//                     email: req.body.email,
//                     password: hash
//                 })
//                 user.save()
//                     .then(() => res.status(201).json({ message: "User created!" }))
//                     .catch(error => res.status(400).json({ message: error.message }))
//             })
//             .catch(error => res.status(500).json({ message: error.message }))
//     } else {
//         res.status(400).json({ message: 'Error! Passwords must be at least 8 characters in length. It should contain at least one upper case English letter, one lower case English letter and one number' })
//     }
// };

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