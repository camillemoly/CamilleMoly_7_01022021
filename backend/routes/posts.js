const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postsCtrl = require('../controllers/posts');

router.get('/', postsCtrl.getAllPosts);
router.put('/:id', postsCtrl.getOnePost);
router.post('/', postsCtrl.createPost);
router.put('/:id', postsCtrl.modifyPost);
router.delete('/:id', postsCtrl.deletePost);
router.post('/:id/like', postsCtrl.likePost);
router.post('/:id/comment', postsCtrl.commentPost);
router.put('/:id/comment/:id', postsCtrl.modifyCommentPost);
router.delete('/:id/comment/:id', postsCtrl.deleteCommentPost);

module.exports = router;