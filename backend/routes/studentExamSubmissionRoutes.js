const express = require('express');
const router = express.Router({ mergeParams: true });

const studentExamSubmissionControllers = require('../controllers/studentExamSubmissionControllers')

/**
 * @swagger
 * tags:
 *   - name: Student Exam Submissions
 *     description: Operations related to student exam submissions
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Student Exam Submissions
 *     summary: Creates a new exam submission entry for a student
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module to which the exam belongs
 *         required: true
 *         schema:
 *           type: integer
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam for which the submission is being created
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: ID of the student making the submission
 *     responses:
 *       '201':
 *         description: New exam submission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_exam_submission_id:
 *                   type: integer
 *                   description: ID of the newly created exam submission entry
 *       '500':
 *         description: Internal server error
 */
router.post('/', studentExamSubmissionControllers.handlePostCreateNewExamSubmissionEntry)

/**
 * shallow information on exam submissions
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Student Exam Submissions
 *     summary: Retrieves all submissions for a specific exam, including rubric component marks
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module to which the exam belongs
 *         required: true
 *         schema:
 *           type: integer
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam for which submissions are being retrieved
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of exam submissions with rubric component marks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_exam_submission_id:
 *                     type: integer
 *                     description: ID of the student exam submission
 *                   marked_for_training:
 *                     type: boolean
 *                     description: Indicates if the submission is marked for training
 *                   exam_id:
 *                     type: integer
 *                     description: ID of the exam
 *                   student_id:
 *                     type: integer
 *                     description: ID of the student
 *                   marker_mark:
 *                     type: number
 *                     format: float
 *                     description: Total marker's mark for the submission
 *                   file_system_id:
 *                     type: string
 *                     description: ID of the file system related to the submission
 *                   student_name:
 *                     type: string
 *                     description: Name of the student
 *                   student_number:
 *                     type: string
 *                     description: Number of the student
 *                   rubric_component_marks:
 *                     type: object
 *                     additionalProperties:
 *                       type: number
 *                       format: float
 *                       description: Mark for each rubric component
 *       '500':
 *         description: Internal server error
 */
router.get('/', studentExamSubmissionControllers.handleGetExamSubmissionEntryByExamId)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission/{student_exam_submission_id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Student Exam Submissions
 *     summary: Deletes a specific exam submission entry by student exam submission ID
 *     parameters:
 *       - name: student_exam_submission_id
 *         in: path
 *         description: ID of the student exam submission to be deleted
 *         required: true
 *         schema:
 *           type: integer
 *       - name: module_id
 *         in: path
 *         description: Module ID of the student exam submission to be deleted
 *         required: true
 *         schema:
 *           type: integer      
 *       - name: exam_id
 *         in: path
 *         description: Exam ID of the student exam submission to be deleted
 *         required: true
 *         schema:
 *           type: integer      
 *     responses:
 *       '204':
 *         description: Successfully deleted the exam submission entry
 *       '500':
 *         description: Internal server error
 */
router.delete('/:student_exam_submission_id', studentExamSubmissionControllers.handleDeleteExamSubmissionEntryByStudentExamSubmissionId)

/**
 * get submission by submission id - deep information on specific
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission/{student_exam_submission_id}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Student Exam Submissions
 *     summary: Retrieves detailed information about a specific student exam submission by its ID
 *     parameters:
 *       - name: student_exam_submission_id
 *         in: path
 *         description: ID of the student exam submission to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *       - name: module_id
 *         in: path
 *         description: Module ID of the student exam submission to retrieve
 *         required: true
 *         schema:
 *           type: integer      
 *       - name: exam_id
 *         in: path
 *         description: Exam ID of the student exam submission to retrieve
 *         required: true
 *         schema:
 *           type: integer 
 *     responses:
 *       '200':
 *         description: Successfully retrieved the student exam submission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_exam_submission_id:
 *                   type: integer
 *                   description: The ID of the student exam submission
 *                 exam_id:
 *                   type: integer
 *                   description: The ID of the associated exam
 *                 is_locked:
 *                   type: boolean
 *                   description: Indicates if the exam is locked
 *                 student_id:
 *                   type: integer
 *                   description: The ID of the student
 *                 file_system_id:
 *                   type: integer
 *                   description: The ID of the file system entry for the submission
 *                 module_id:
 *                   type: integer
 *                   description: The ID of the associated module
 *                 exam_name:
 *                   type: string
 *                   description: The name of the exam
 *                 exam_question:
 *                   type: string
 *                   description: The question for the exam
 *                 prompt_specifications:
 *                   type: string
 *                   description: Specifications for the exam prompt
 *                 chosen_ai_model_id:
 *                   type: integer
 *                   description: The ID of the chosen AI model
 *                 module_name:
 *                   type: string
 *                   description: The name of the module
 *                 student_name:
 *                   type: string
 *                   description: The name of the student
 *                 student_number:
 *                   type: string
 *                   description: The number of the student
 *                 rubric:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the rubric component
 *                       rubric_component_desc:
 *                         type: string
 *                         description: Description of the rubric component
 *                       maximum:
 *                         type: integer
 *                         description: The maximum mark for the rubric component
 *                       rubric_component_id:
 *                         type: integer
 *                         description: The ID of the rubric component
 *                       rubric_component_submission_mark_id:
 *                         type: integer
 *                         description: The ID of the rubric component submission mark
 *                       student_exam_submission_id:
 *                         type: integer
 *                         description: The ID of the student exam submission
 *                       rubric_component_mark:
 *                         type: integer
 *                         description: The mark given for the rubric component
 *                       rubric_component_critique:
 *                         type: string
 *                         description: Critique provided for the rubric component
 *                       ai_mark:
 *                         type: integer
 *                         description: AI-generated mark for the rubric component
 *                       ai_critique:
 *                         type: string
 *                         description: AI-generated critique for the rubric component
 *                       rating_ranges:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: The ID of the rating range
 *                             rubric_component_id:
 *                               type: integer
 *                               description: The ID of the rubric component
 *                             min_value:
 *                               type: integer
 *                               description: Minimum value for the rating range
 *                             max_value:
 *                               type: integer
 *                               description: Maximum value for the rating range
 *                             description:
 *                               type: string
 *                               description: Description of the rating range
 *       '500':
 *         description: Internal server error
 */
router.get('/:student_exam_submission_id', studentExamSubmissionControllers.handleGetStudentExamSubmissionByExamSubmissionId)

/**
 * update rubric component mark...
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission/{student_exam_submission_id}/rubric_component/{rubric_component_id}:
 *   put:
 *     summary: Update a rubric component mark for a student's exam submission
 *     tags:
 *       - Student Exam Submissions
 *     description: Updates the mark for a specific rubric component for a given student's exam submission.
 *     parameters:
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the rubric component to update.
 *       - name: student_exam_submission_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the student's exam submission.
 *       - name: module_id
 *         in: path
 *         description: Module ID of the student exam submission to update
 *         required: true
 *         schema:
 *           type: integer      
 *       - name: exam_id
 *         in: path
 *         description: Exam ID of the student exam submission to update
 *         required: true
 *         schema:
 *           type: integer 
 *       - name: rubric_component_mark
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             rubric_component_mark:
 *               type: number
 *               format: float
 *               example: 85.5
 *               description: The mark to assign to the rubric component.
 *     responses:
 *       '200':
 *         description: Rubric component mark updated successfully.
 *       '400':
 *         description: Bad Request - The provided data is invalid or missing required fields.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.put('/:student_exam_submission_id/rubric_component/:rubric_component_id', studentExamSubmissionControllers.handlePutUpdateRubricComponentMark)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission/{student_exam_submission_id}:
 *   put:
 *     summary: Update details of a student's exam submission
 *     tags: [Student Exam Submissions]
 *     description: Updates various details of a student's exam submission, including file system ID and other fields.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *         description: ID of the module associated with the exam.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 202
 *         description: ID of the exam being updated.
 *       - name: student_exam_submission_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: ID of the student's exam submission to update.
 *       - name: updateFields
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             file_system_id:
 *               type: integer
 *               example: 404
 *               description: The file system ID associated with the student's exam submission.
 *              
 *     responses:
 *       '200':
 *         description: Student exam submission updated successfully.
 *       '400':
 *         description: Bad Request - The provided data is invalid or includes invalid column names.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.put('/:student_exam_submission_id', studentExamSubmissionControllers.handlePutUpdateStudentExamSubmission)



/**
 * rubric component ai interactions
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission/{student_exam_submission_id}/ai:
 *   post:
 *     summary: Request new AI critique for a student's exam submission
 *     tags: [Student Exam Submissions]
 *     description: Requests a new AI-generated critique for the student's exam submission, provided the exam is locked. Returns the updated student exam submission object.
 *     parameters:
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 202
 *         description: ID of the exam for which the critique is requested.
 *       - name: student_exam_submission_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: ID of the student's exam submission that needs the AI critique.
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: Module ID of the student's exam submission that needs the AI critique.
 *     
 * 
 *     responses:
 *       '201':
 *         description: New AI critique successfully generated and added to the student's exam submission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_exam_submission_id:
 *                   type: integer
 *                   example: 303
 *                   description: ID of the student's exam submission.
 *                 exam_id:
 *                   type: integer
 *                   example: 202
 *                   description: ID of the exam.
 *                 is_locked:
 *                   type: integer
 *                   example: 1
 *                   description: Indicates if the exam is locked (1) or not (0).
 *                 student_id:
 *                   type: integer
 *                   example: 101
 *                   description: ID of the student who made the submission.
 *                 file_system_id:
 *                   type: integer
 *                   example: 404
 *                   description: ID associated with the file system entry.
 *                 module_id:
 *                   type: integer
 *                   example: 404
 *                   description: ID of the module associated with the exam.
 *                 exam_name:
 *                   type: string
 *                   example: "Final Exam"
 *                   description: Name of the exam.
 *                 exam_question:
 *                   type: string
 *                   example: "Write a software system to accomplish some goal."
 *                   description: Question or prompt of the exam.
 *                 prompt_specifications:
 *                   type: string
 *                   example: "Please answer in 500 words."
 *                   description: Specifications or guidelines for the exam prompt.
 *                 chosen_ai_model_id:
 *                   type: integer
 *                   example: 3
 *                   description: ID of the AI model used for critique.
 *                 module_name:
 *                   type: string
 *                   example: "Environmental Science"
 *                   description: Name of the module associated with the exam.
 *                 student_name:
 *                   type: string
 *                   example: "John Doe"
 *                   description: Name of the student who made the submission.
 *                 student_number:
 *                   type: string
 *                   example: "S12345"
 *                   description: Student's identification number.
 *                 rubric:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rubric_component_id:
 *                         type: integer
 *                         example: 1
 *                         description: ID of the rubric component.
 *                       name:
 *                         type: string
 *                         example: "Introduction"
 *                         description: Name of the rubric component.
 *                       rubric_component_desc:
 *                         type: string
 *                         example: "Introduction to the topic."
 *                         description: Description of the rubric component.
 *                       maximum:
 *                         type: integer
 *                         example: 10
 *                         description: Maximum score for the rubric component.
 *                       rubric_component_mark:
 *                         type: integer
 *                         example: 8
 *                         description: Mark awarded for the rubric component.
 *                       rubric_component_critique:
 *                         type: string
 *                         example: "Well written introduction."
 *                         description: Critique provided by the marker.
 *                       ai_mark:
 *                         type: integer
 *                         example: 7
 *                         description: Mark awarded by AI for the rubric component.
 *                       ai_critique:
 *                         type: string
 *                         example: "Introduction could be more detailed."
 *                         description: Critique provided by AI for the rubric component.
 *                       rating_ranges:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             range:
 *                               type: string
 *                               example: "6-8"
 *                               description: Rating range for the rubric component.
 *                             description:
 *                               type: string
 *                               example: "Good"
 *                               description: Description of the rating range.
 *       
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.post('/:student_exam_submission_id/ai', studentExamSubmissionControllers.handlePostGetNewAICritique)


/**
 * mark a student exam submission for training
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/student_exam_submission/{student_exam_submission_id}/marked_for_training:
 *   post:
 *     summary: Mark student exam submission for training
 *     tags: [Student Exam Submissions]
 *     description: Marks a student exam submission for training purposes. This typically involves flagging the submission for further review or analysis.
 *     parameters:
 *       - name: student_exam_submission_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: ID of the student exam submission to be marked for training.
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: Module ID of the student exam submission to be marked for training.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: Exam ID of the student exam submission to be marked for training.
 *     responses:
 *       '200':
 *         description: The student exam submission was successfully marked for training.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.put('/:student_exam_submission_id/marked_for_training', studentExamSubmissionControllers.handleMarkSESForTraining)


/**
 * unmark a student exam submission for training
 */

/**
 * @swagger
 * /module/{module_id/exam/{exam_id}/submission/{student_exam_submission_id}/marked_for_training:
 *   delete:
 *     summary: Unmark student exam submission for training
 *     tags: [Student Exam Submissions]
 *     description: Removes the training flag from a student exam submission, indicating that it should no longer be used for training purposes.
 *     parameters:
 *       - name: student_exam_submission_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: ID of the student exam submission to be unmarked for training.
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: Module ID of the student exam submission to be unmarked for training.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 303
 *         description: Exam ID of the student exam submission to be unmarked for training.
 *     responses:
 *       '200':
 *         description: The student exam submission was successfully unmarked for training.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.delete('/:student_exam_submission_id/marked_for_training', studentExamSubmissionControllers.handleUnmarkSESForTraining)


module.exports = router