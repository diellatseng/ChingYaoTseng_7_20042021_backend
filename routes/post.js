const router = require('express').Router();

const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, postCtrl.createPost);

// router.get('/comment', auth, postCtrl.getAllComments);

module.exports = router;

// const sauceCtrl = require('../controllers/sauce');
// // const multer = require('../middleware/multer-config')

// // router.get('/', auth, sauceCtrl.getSauce);
// // router.post('/', auth, multer, sauceCtrl.createSauce);
// // router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// // router.delete('/:id', auth, sauceCtrl.deleteSauce);
// // router.post('/:id/like', auth, sauceCtrl.likeSauce);
