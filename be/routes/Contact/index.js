const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Contact');

// 라우팅
router.post('/postContact', controller.postContact);
router.get('/findList', controller.getContactFindList);
router.get('/findOne', controller.getContactFindOne);

module.exports = router;