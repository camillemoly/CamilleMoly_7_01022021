const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postsCtrl = require("../controllers/posts");

router.get("/", postsCtrl.getAllPosts);
router.get("/:id", postsCtrl.getOnePost);
router.post("/", postsCtrl.createPost);
router.put("/:id", postsCtrl.modifyPost);
router.delete("/:id", postsCtrl.deletePost);
router.post("/:id/likes", postsCtrl.likePost);
router.delete("/:id/likes/:id", postsCtrl.cancelLikePost);
router.post("/:id/comments", postsCtrl.commentPost);
router.put("/:id/comments/:id", postsCtrl.modifyCommentPost);
router.delete("/:id/comments/:id", postsCtrl.deleteCommentPost);

module.exports = router;
