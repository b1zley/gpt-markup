const express = require('express');
const router = express.Router({ mergeParams: true });

const examControllers = require('../controllers/examControllers')

router.post('/', examControllers.createNewExam)
router.put('/:exam_id', examControllers.updateExam)

router.get('/:exam_id', examControllers.getExamById)
router.get('/', examControllers.getExamsByModule)


router.delete('/:exam_id', examControllers.deleteExamController)


// remove access of super user (in practice, always a marker) to exam
router.delete('/:exam_id/super_user/:super_user_id', examControllers.requestHandlerDeleteSuperUserInExam )

// add access of super user (in practice, always a marker) to exam
router.post('/:exam_id/super_user', examControllers.requestHandlerPostSuperUserInExam)




module.exports = router

