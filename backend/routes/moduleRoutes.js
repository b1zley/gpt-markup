const express = require('express');
const router = express.Router();

const moduleControllers = require('../controllers/moduleControllers')

router.get('/', moduleControllers.getAllModuleIds)
router.get('/:module_id', moduleControllers.getModuleDataByModuleId)
router.get('/:module_id/exam', moduleControllers.getExamsByModule)

module.exports = router