const express = require('express');
const router = express.Router({ mergeParams: true });

const multer = require('multer')
const path = require('path')

const upload = multer({dest: path.join(__dirname, '../uploads/STAGING' )})



const rubricControllers = require('../controllers/rubricControllers')


// router.get('/', )

/**
 * @swagger
 * tags:
 *   - name: Rubric
 *     description: Operations related to Rubrics within an Exam
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}:
 *   delete:
 *     summary: Remove a rubric component from an exam
 *     tags: [Rubric]
 *     description: Deletes a specific rubric component from an exam. The rubric component is identified by its ID and is associated with a particular exam.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module to which the exam belongs.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam from which the rubric component will be removed.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to be removed.
 *     responses:
 *       '204':
 *         description: Successfully removed the rubric component from the exam.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.delete('/:rubric_component_id', rubricControllers.handleRemoveRubricFromExam)

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric:
 *   post:
 *     tags: [Rubric]
 *     summary: Add a new rubric component to an exam
 *     description: Adds a new rubric component to a specific exam. The rubric component is associated with the exam and includes details like its name.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam to which the rubric component will be added.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rubric_component_name:
 *                 type: string
 *                 example: "Presentation Quality"
 *                 description: Name of the new rubric component to be added.
 *     responses:
 *       '201':
 *         description: Successfully created a new rubric component and added it to the exam.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rubric_component_id:
 *                   type: integer
 *                   example: 456
 *                   description: ID of the newly created rubric component.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.post('/', rubricControllers.handlePostNewRubricToExam)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}:
 *   get:
 *     tags: [Rubric]
 *     summary: Retrieve detailed information about a specific rubric component
 *     description: Fetches detailed information for a specific rubric component, including its associated exam and module information, as well as any rating ranges.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam that contains the rubric component.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to retrieve.
 *     responses:
 *       '200':
 *         description: Successfully retrieved the rubric component details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rubric_component_id:
 *                   type: integer
 *                   example: 456
 *                   description: ID of the rubric component.
 *                 name:
 *                   type: string
 *                   example: "Presentation Quality"
 *                   description: Name of the rubric component.
 *                 rubric_component_desc:
 *                   type: string
 *                   example: "Quality of presentation."
 *                   description: Description of the rubric component.
 *                 maximum:
 *                   type: integer
 *                   example: 10
 *                   description: Maximum score for the rubric component.
 *                 exam_id:
 *                   type: integer
 *                   example: 123
 *                   description: ID of the exam this rubric component is associated with.
 *                 exam_name:
 *                   type: string
 *                   example: "Final Exam"
 *                   description: Name of the exam.
 *                 module_id:
 *                   type: integer
 *                   example: 10
 *                   description: ID of the module this exam belongs to.
 *                 module_name:
 *                   type: string
 *                   example: "Module 1"
 *                   description: Name of the module.
 *                 rating_ranges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rating_range_id:
 *                         type: integer
 *                         example: 789
 *                         description: ID of the rating range.
 *                       range_min:
 *                         type: integer
 *                         example: 1
 *                         description: Minimum value of the rating range.
 *                       range_max:
 *                         type: integer
 *                         example: 5
 *                         description: Maximum value of the rating range.
 *                       description:
 *                         type: string
 *                         example: "Poor"
 *                         description: Description of the rating range.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.get('/:rubric_component_id', rubricControllers.handleGetRubricComponentById)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}:
 *   put:
 *     tags: [Rubric]
 *     summary: Update a rubric component by its ID
 *     description: Updates the details of a specific rubric component by its ID. Accepts a list of fields to update and their new values.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam that contains the rubric component.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Presentation Quality"
 *                 description: New name of the rubric component.
 *               rubric_component_desc:
 *                 type: string
 *                 example: "Quality of presentation."
 *                 description: New description of the rubric component.
 *               maximum:
 *                 type: integer
 *                 example: 10
 *                 description: New maximum score for the rubric component.
 *     responses:
 *       '200':
 *         description: Successfully updated the rubric component.
 *       
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.put('/:rubric_component_id', rubricControllers.handlePutUpdateRubricComponentById)


// rating range

/**
 * create
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}/rating_range:
 *   post:
 *     tags: [Rubric]
 *     summary: Add a new rating range to a rubric component
 *     description: Creates a new rating range for a specified rubric component. Returns the ID of the newly created rating range.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam that contains the rubric component.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to which the rating range will be added.
 *     responses:
 *       '201':
 *         description: Successfully created a new rating range. Returns the ID of the new rating range.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating_range_id:
 *                   type: integer
 *                   example: 789
 *                   description: The ID of the newly created rating range.
 *       '404':
 *         description: Not Found - The rubric component with the given ID does not exist.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.post('/:rubric_component_id/rating_range/', rubricControllers.handlePostRatingRangeInRubricComponent )

/**
 * update
 */

/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}/rating-range/{rating_range_id}:
 *   put:
 *     tags: [Rubric]
 *     summary: Update a rating range in a rubric component
 *     description: Updates the details of a specific rating range associated with a rubric component. Requires the ID of the rating range and the fields to update.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam that contains the rubric component.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to which the rating range belongs.
 *       - name: rating_range_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 789
 *         description: ID of the rating range to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               min_value:
 *                 type: integer
 *                 description: The minimum value of the rating range.
 *               max_value:
 *                 type: integer
 *                 description: The maximum value of the rating range.
 *               description:
 *                 type: string
 *                 description: A description of the rating range.
 *             example:
 *               min_value: 1
 *               max_value: 5
 *               description: "Rating range from 1 to 5"
 *     responses:
 *       '200':
 *         description: Successfully updated the rating range.
 *       
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.put('/:rubric_component_id/rating_range/:rating_range_id', rubricControllers.handlePutRequestRatingRange)

/**
 * delete rating range
 */
/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}/rating-range/{rating_range_id}:
 *   delete:
 *     tags: [Rubric]
 *     summary: Delete a rating range from a rubric component
 *     description: Deletes a specific rating range associated with a rubric component. Requires the ID of the rating range to be deleted.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam that contains the rubric component.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to which the rating range belongs.
 *       - name: rating_range_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 789
 *         description: ID of the rating range to be deleted.
 *     responses:
 *       '204':
 *         description: Successfully deleted the rating range.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 */
router.delete('/:rubric_component_id/rating_range/:rating_range_id', rubricControllers.handleDeleteRatingRange)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/csv:
 *   post:
 *     tags: [Rubric]
 *     summary: Upload and process a CSV file to create rubric components
 *     description: Parses a CSV file to create new rubric components for a specified exam. Each row in the CSV represents a rubric component, with optional rating ranges. Returns the updated list of rubric components for the exam.
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam to which rubric components will be added.
 *       - name: file
 *         in: formData
 *         required: true
 *         schema:
 *           type: file
 *           description: CSV file containing rubric components and their rating ranges.
 *     responses:
 *       '201':
 *         description: Successfully uploaded and processed the CSV file. Returns the updated rubric components for the exam.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rubric_component_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   rubric_component_desc:
 *                     type: string
 *                   maximum:
 *                     type: integer
 *                   rating_ranges:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         rangeDesc:
 *                           type: string
 *                         rangeMin:
 *                           type: integer
 *                         rangeMax:
 *                           type: integer
 *       
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the CSV file.
 */
router.post('/csv_upload', upload.single('file'), rubricControllers.handleRequestCSVUploadRubricComponents)


/**
 * @swagger
 * /module/{module_id}/exam/{exam_id}/rubric/{rubric_component_id}/rating:
 *   post:
 *     tags: [Rubric]
 *     summary: Create a new rating range for a rubric component
 *     description: Creates a new rating range for a specified rubric component within an exam. The rating range includes a description, minimum, and maximum values (inclusive).
 *     parameters:
 *       - name: module_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID of the module that the exam belongs to.
 *       - name: exam_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the exam where the rubric component is located.
 *       - name: rubric_component_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: ID of the rubric component to which the rating range will be added.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating_desc:
 *                 type: string
 *                 example: "Excellent"
 *                 description: Description of the rating range.
 *               rating_min_incl:
 *                 type: integer
 *                 example: 0
 *                 description: Minimum value of the rating range, inclusive.
 *               rating_max_incl:
 *                 type: integer
 *                 example: 100
 *                 description: Maximum value of the rating range, inclusive.
 *     responses:
 *       '201':
 *         description: Successfully created a new rating range for the rubric component. Returns the ID of the new rating range.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating_range_id:
 *                   type: integer
 *                   description: ID of the newly created rating range.
 *       '400':
 *         description: Bad Request - Missing or invalid parameters in the request body.
 *       '500':
 *         description: Internal Server Error - An error occurred while creating the rating range.
 */
router.post('/:rubric_component_id/rating_range/complete', rubricControllers.handlePostRequestCreateNewRatingRangeComplete)

module.exports = router

