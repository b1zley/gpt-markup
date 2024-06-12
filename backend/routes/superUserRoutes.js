const express = require('express');
const router = express.Router();

const superUserControllers = require('../controllers/superUserControllers')

router.get('/', superUserControllers.getAllSuperUsers)
router.get('/exam_search', superUserControllers.getExamAccessSuperUsersByQueryParams)

router.get('/super_user_type_id/:super_user_type_id/', superUserControllers.requestHandlerGetSuperUserBySuperUserType )


module.exports = router