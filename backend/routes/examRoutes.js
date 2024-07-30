const express = require('express');
const router = express.Router({ mergeParams: true });

const examControllers = require('../controllers/examControllers')

/**
 * @swagger
 * tags:
 *   - name: Exam
 *     description: Operations related to exams
 */

/**
 * @swagger
 * /module/{module_id}/exam:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Creates a new exam for a given module
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module
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
 *               exam_name:
 *                 type: string
 *                 description: Name of the exam
 *     responses:
 *       '201':
 *         description: Exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exam_id:
 *                   type: integer
 *                   description: ID of the newly created exam
 *       '400':
 *         description: Bad request, missing module_id or exam_name
 *       '500':
 *         description: Internal server error
 */
router.post('/', examControllers.createNewExam)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Updates an existing exam by exam ID
 *     parameters:
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam to be updated
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
 *               exam_name:
 *                 type: string
 *                 description: Name of the exam
 *               module_id:
 *                 type: integer
 *                 description: ID of the module
 *               exam_question:
 *                 type: string
 *                 description: Exam question
 *               file_system_id:
 *                 type: integer
 *                 description: ID of the file system
 *               prompt_specifications:
 *                 type: string
 *                 description: Prompt specifications
 *               chosen_ai_model_id:
 *                 type: integer
 *                 description: ID of the chosen AI model
 *               temperature:
 *                 type: number
 *                 format: float
 *                 description: Temperature for AI model
 *               top_p:
 *                 type: number
 *                 format: float
 *                 description: Top P for AI model
 *     responses:
 *       '200':
 *         description: Exam updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exam_id:
 *                   type: integer
 *                   description: ID of the updated exam
 *                 exam_name:
 *                   type: string
 *                   description: Name of the exam
 *                 module_id:
 *                   type: integer
 *                   description: ID of the module
 *                 exam_question:
 *                   type: string
 *                   description: Exam question
 *                 file_system_id:
 *                   type: integer
 *                   description: ID of the file system
 *                 prompt_specifications:
 *                   type: string
 *                   description: Prompt specifications
 *                 chosen_ai_model_id:
 *                   type: integer
 *                   description: ID of the chosen AI model
 *                 temperature:
 *                   type: number
 *                   format: float
 *                   description: Temperature for AI model
 *                 top_p:
 *                   type: number
 *                   format: float
 *                   description: Top P for AI model
 *       '500':
 *         description: Internal server error
 */
router.put('/:exam_id', examControllers.updateExam)

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Retrieves an exam by exam ID
 *     parameters:
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *       - name: module_id
 *         in: path
 *         description: Module ID of the exam to retrieve
 *         required: true
 *         schema:
 *           type: integer 
 *     responses:
 *       '200':
 *         description: Successfully retrieved the exam
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exam_id:
 *                   type: integer
 *                   description: ID of the exam
 *                 exam_name:
 *                   type: string
 *                   description: Name of the exam
 *                 module_id:
 *                   type: integer
 *                   description: ID of the module
 *                 exam_question:
 *                   type: string
 *                   description: Exam question
 *                 file_system_id:
 *                   type: integer
 *                   description: ID of the file system
 *                 prompt_specifications:
 *                   type: string
 *                   description: Prompt specifications
 *                 chosen_ai_model_id:
 *                   type: integer
 *                   description: ID of the chosen AI model
 *                 temperature:
 *                   type: number
 *                   format: float
 *                   description: Temperature for AI model
 *                 top_p:
 *                   type: number
 *                   format: float
 *                   description: Top P for AI model
 *                 rubric:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rubric_component_id:
 *                         type: integer
 *                         description: ID of the rubric component
 *                       rubric_component_description:
 *                         type: string
 *                         description: Description of the rubric component
 *                 fileTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       file_type_id:
 *                         type: integer
 *                         description: ID of the file type
 *                       file_type_description:
 *                         type: string
 *                         description: Description of the file type
 *       '404':
 *         description: Exam not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:exam_id', examControllers.getExamById)

/**
 * @swagger
 * /module/{module_id}/exam:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Retrieves exams by module ID
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module to retrieve exams for
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved exams for the module
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   exam_id:
 *                     type: integer
 *                     description: ID of the exam
 *                   module_id:
 *                     type: integer
 *                     description: ID of the module
 *                   exam_name:
 *                     type: string
 *                     description: Name of the exam
 *                   exam_question:
 *                     type: string
 *                     description: Exam question
 *                   file_system_id:
 *                     type: integer
 *                     description: ID of the file system
 *                   prompt_specifications:
 *                     type: string
 *                     description: Prompt specifications
 *                   chosen_ai_model_id:
 *                     type: integer
 *                     description: ID of the chosen AI model
 *                   temperature:
 *                     type: number
 *                     format: float
 *                     description: Temperature for AI model
 *                   top_p:
 *                     type: number
 *                     format: float
 *                     description: Top P for AI model
 *       '500':
 *         description: Internal server error
 */
router.get('/', examControllers.getExamsByModule)

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Deletes an exam by ID
 *     parameters:
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam to delete
 *         required: true
 *         schema:
 *           type: integer
 *       - name: module_id
 *         in: path
 *         description: Module ID of the exam to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Successfully deleted the exam
 *       '500':
 *         description: Internal server error
 */

router.delete('/:exam_id', examControllers.deleteExamController)


// remove access of super user (in practice, always a marker) to exam
/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/super_user/{super_user_id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Removes a super user's access to a specific exam
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module
 *         required: true
 *         schema:
 *           type: integer
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam
 *         required: true
 *         schema:
 *           type: integer
 *       - name: super_user_id
 *         in: path
 *         description: ID of the super user to remove from the exam
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Successfully removed the super user from the exam
 *       '500':
 *         description: Internal server error
 */
router.delete('/:exam_id/super_user/:super_user_id', examControllers.requestHandlerDeleteSuperUserInExam )


// add access of super user (in practice, always a marker) to exam


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/super_users:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Adds a super user to a specific exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               super_user_id:
 *                 type: integer
 *                 description: ID of the super user to add to the exam
 *     parameters:
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam
 *         required: true
 *         schema:
 *           type: integer
 *       - name: module
 *         in: path
 *         description: Module ID of the exam
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Successfully added the super user to the exam
 *       '500':
 *         description: Internal server error
 */
router.post('/:exam_id/super_user', examControllers.requestHandlerPostSuperUserInExam)


// student exam submission creation
const studentExamSubmissionRoutes = require('./studentExamSubmissionRoutes')
router.use('/:exam_id/student_exam_submission', studentExamSubmissionRoutes)


// add new file type

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/file_types:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Adds a file type to a specific exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file_type_id:
 *                 type: integer
 *                 description: ID of the file type to add to the exam
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module
 *         required: true
 *         schema:
 *           type: integer
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Successfully added the file type to the exam
 *       '500':
 *         description: Internal server error
 */
router.post('/:exam_id/file_type', examControllers.handlePostFileTypeToExam)

// delete file type

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/file_type/{file_type_id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Removes a file type from a specific exam
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: ID of the module
 *         required: true
 *         schema:
 *           type: integer
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam
 *         required: true
 *         schema:
 *           type: integer
 *       - name: file_type_id
 *         in: path
 *         description: ID of the file type to remove from the exam
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Successfully removed the file type from the exam
 *       '500':
 *         description: Internal server error
 */
router.delete('/:exam_id/file_type/:file_type_id', examControllers.handleDeleteFileTypeFromExam)





// generate and download csv file of exam results

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/results/csv:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Exam
 *     summary: Retrieves exam results as a CSV file
 *     parameters:
 *       - name: exam_id
 *         in: path
 *         description: ID of the exam for which to retrieve results
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: CSV file containing the exam results
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: Internal server error
 */
router.get('/:exam_id/results_csv', examControllers.requestHandlerGetResultsAsCSV)

// endpoints for rubric
const rubricRoutes = require('./rubricRoutes')
router.use('/:exam_id/rubric', rubricRoutes)



module.exports = router

