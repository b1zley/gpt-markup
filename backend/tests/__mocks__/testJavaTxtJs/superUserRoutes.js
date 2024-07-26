const express = require('express');
const router = express.Router();

const superUserControllers = require('../controllers/superUserControllers')

router.get('/', superUserControllers.getAllSuperUsers)
router.get('/exam_search', superUserControllers.getExamAccessSuperUsersByQueryParams)

router.get('/super_user_type_id/:super_user_type_id/', superUserControllers.requestHandlerGetSuperUserBySuperUserType )

router.get('/module/:module_id', superUserControllers.requestHandlerGetLecturerModuleAccess)


router.delete('/module/:module_id/lecturer/:super_user_id', superUserControllers.requestHandlerDeleteLecturerModuleAccess)


router.post('/module/:module_id/lecturer', superUserControllers.handlePostLecturerToModule)

module.exports = router