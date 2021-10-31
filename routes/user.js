const router = require('express').Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

router.get('/', auth, userCtrl.getOneUser);
router.delete('/', auth, userCtrl.deleteUser);


module.exports = router;