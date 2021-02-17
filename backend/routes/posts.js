const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postsCtrl = require("../controllers/posts");

router.get("/", auth, postsCtrl.getAllPosts);
router.get("/:id", auth, postsCtrl.getOnePost);
router.post("/", auth, postsCtrl.createPost);
router.put("/:id", auth, postsCtrl.modifyPost);
router.delete("/:id", auth, postsCtrl.deletePost);
router.post("/:id/likes", auth, postsCtrl.likePost);
router.delete("/:id/likes/:id", auth, postsCtrl.unlikePost);
router.post("/:id/comments", auth, postsCtrl.commentPost);
router.put("/:id/comments/:id", auth, postsCtrl.modifyCommentPost);
router.delete("/:id/comments/:id", auth, postsCtrl.deleteCommentPost);

module.exports = router;
