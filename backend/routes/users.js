const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const usersCtrl = require("../controllers/users");

router.get("/:id", auth, usersCtrl.getOneUser);
router.put("/:id", auth, usersCtrl.modifyUser);
router.delete("/:id", auth, usersCtrl.deleteUser);

module.exports = router;
