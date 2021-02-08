const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const connectCtrl = require('../controllers/connect');

router.post('/signup', connectCtrl.signup);
router.post('/login', connectCtrl.login);

module.exports = router;