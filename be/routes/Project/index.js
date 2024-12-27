const express = require('express');
const router = express.Router();
const controller = require('../../controllers/Project');

// 라우팅
router.get('/listAll', controller.getProjectListAll);
router.get('/findOne', controller.getProjectFindOne);
router.post('/addProject', controller.postProjectInfo);
router.put('/updateProject', controller.updateProjectInfo);
router.delete('/deleteProject', controller.deleteProjectInfo);

module.exports = router;