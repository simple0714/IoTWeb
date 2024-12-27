const express = require('express');
const router = express.Router();
const controller = require('../../controllers/About');

// 라우팅
router.get('/', controller.getAboutInfo);
router.post('/addAbout', controller.postAboutInfo);
router.get('/findOne', controller.findOneAboutInfo);
router.put('/updateAbout', controller.updateAboutInfo);
router.delete('/deleteAbout', controller.deleteAboutInfo);  

module.exports = router;