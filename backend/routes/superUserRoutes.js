const express = require('express');
const router = express.Router();

const superUserControllers = require('../controllers/superUserControllers')

router.get('/', superUserControllers.getAllSuperUsers)
router.get('/exam_search', superUserControllers.getExamAccessSuperUsersByQueryParams)



module.exports = router