const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postsCtrl = require("../controllers/posts");

router.get("/all/pagination", auth, postsCtrl.getAllPostsAndPagination);

router.get("/all", auth, postsCtrl.getAllPosts);
router.get("/all/:user_id", auth, postsCtrl.getAllPostsOfUser);
router.post("/", auth, multer, postsCtrl.createPost);
router.put("/:id", auth, multer, postsCtrl.modifyPost);
router.delete("/:id", auth, multer, postsCtrl.deletePost);
router.get("/:id/likes/all", auth, postsCtrl.getAllLikesOfAPost);
router.post("/:id/likes", auth, postsCtrl.likePost);
router.delete("/:id/likes", auth, postsCtrl.unlikePost);
router.get("/:id/comments/all", auth, postsCtrl.getAllCommentsOfAPost);
router.post("/:id/comments", auth, postsCtrl.commentPost);
router.put("/:id/comments/:comment_id", auth, postsCtrl.modifyCommentPost);
router.delete("/:id/comments/:comment_id", auth, postsCtrl.deleteCommentPost);

module.exports = router;
