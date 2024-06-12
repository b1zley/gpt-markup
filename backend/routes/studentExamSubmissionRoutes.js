const express = require('express');
const router = express.Router({ mergeParams: true });

const studentExamSubmissionControllers = require('../controllers/studentExamSubmissionControllers')

router.post('/', studentExamSubmissionControllers.handlePostCreateNewExamSubmissionEntry)

/**
 * shallow information on exam submissions
 */
router.get('/', studentExamSubmissionControllers.handleGetExamSubmissionEntryByExamId)

module.exports = router