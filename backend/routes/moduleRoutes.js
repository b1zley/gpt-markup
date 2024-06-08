const express = require('express');
const router = express.Router();

const moduleControllers = require('../controllers/moduleControllers')
const examRoutes = require('./examRoutes')

// handle exams as subservient to modules
router.use('/:module_id/exam', examRoutes)

router.get('/', moduleControllers.getAllModuleIds)
router.get('/:module_id', moduleControllers.getModuleDataByModuleId)

router.post('/', moduleControllers.createNewModule)




module.exports = router