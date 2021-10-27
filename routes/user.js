const router = require('express').Router();

// router.get('/', async(req, res, next) => {
//     res.send({ message: 'user routes'});
// })

const userCtrl = require('../controllers/user');

router.get('/signup', userCtrl.signup);
// router.post('/login', userCtrl.login);


module.exports = router;