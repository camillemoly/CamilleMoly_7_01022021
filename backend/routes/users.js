const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const usersCtrl = require("../controllers/users");

router.get("/:id", usersCtrl.getOneUser);
router.put("/:id", usersCtrl.modifyUser);
router.delete("/:id", usersCtrl.deleteUser);

module.exports = router;
