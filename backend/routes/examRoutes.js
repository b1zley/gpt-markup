const express = require('express');
const router = express.Router({ mergeParams: true });

const examControllers = require('../controllers/examControllers')

router.post('/', examControllers.createNewExam)
router.put('/:exam_id', examControllers.updateExam)

router.get('/:exam_id', examControllers.getExamById)
router.get('/', examControllers.getExamsByModule)

module.exports = router

