const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Admin');

// 라우팅
router.post('/signUp', controller.postSignUp);
router.get('/login', controller.getLoginInfo);
router.get('/findId', controller.getFindId);
router.get('/findPw', controller.getFindPw);
router.put('/changePw', controller.putChangePw);

module.exports = router;