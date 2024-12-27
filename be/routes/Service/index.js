const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Service');

// 라우팅
router.get('/list', controller.getServiceListAll);
router.get('/findOne', controller.getServiceFindOne);
router.post('/addService', controller.postServiceInfo);
router.put('/updateService', controller.updateServiceInfo);
router.delete('/deleteService', controller.deleteServiceInfo);

module.exports = router;