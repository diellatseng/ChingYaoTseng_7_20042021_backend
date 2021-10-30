const router = require('express').Router();
const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

// const multer = require('../middleware/multer-users-config');
// const auth = require('../middleware/auth');

module.exports = router;