const express = require('express');
const router = express.Router({ mergeParams: true });

const studentExamSubmissionControllers = require('../controllers/studentExamSubmissionControllers')

router.post('/', studentExamSubmissionControllers.handlePostCreateNewExamSubmissionEntry)

/**
 * shallow information on exam submissions
 */
router.get('/', studentExamSubmissionControllers.handleGetExamSubmissionEntryByExamId)

router.delete('/:student_exam_submission_id', studentExamSubmissionControllers.handleDeleteExamSubmissionEntryByStudentExamSubmissionId)

/**
 * get submission by submission id - deep information on specific
 */
router.get('/:student_exam_submission_id', studentExamSubmissionControllers.handleGetStudentExamSubmissionByExamSubmissionId)

/**
 * update rubric component mark...
 */
router.put('/:student_exam_submission_id/rubric_component/:rubric_component_id', studentExamSubmissionControllers.handlePutUpdateRubricComponentMark)

router.put('/:student_exam_submission_id', studentExamSubmissionControllers.handlePutUpdateStudentExamSubmission)

module.exports = router