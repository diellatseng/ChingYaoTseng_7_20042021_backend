const router = require('express').Router();

const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.post('/:id/like', auth, postCtrl.likePost);

// router.get('/comment', auth, postCtrl.getAllComments);

module.exports = router;