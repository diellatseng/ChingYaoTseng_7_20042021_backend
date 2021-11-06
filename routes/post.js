const router = require('express').Router();

const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

/* Post */
router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, multer, postCtrl.updatePost);

/* Post- Likes */
router.post('/:id/like', auth, postCtrl.likePost);

/* Post- Comments */
router.get('/:id/comment', auth, postCtrl.getComments);
router.post('/:id/comment', auth, postCtrl.createComment);

module.exports = router;