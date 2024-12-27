const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Partner');

// 라우팅
router.get('/list', controller.getPartnerList);
router.post('/add', controller.addPartnerInfo);
router.put('/update', controller.updatePartnerInfo);
router.delete('/delete', controller.deletePartnerInfo);

module.exports = router;