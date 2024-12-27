const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Stack');

// 라우팅
router.get('/', controller.getStacks);
router.post('/addStack', controller.postAddStack);
router.put('/updateStack', controller.putUpdateStack);

module.exports = router;