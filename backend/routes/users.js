const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const usersCtrl = require("../controllers/users");

router.get("/:id", auth, usersCtrl.getOneUser);
router.put("/:id", auth, multer, usersCtrl.modifyUser);
router.delete("/:id", auth, multer, usersCtrl.deleteUser);

module.exports = router;
