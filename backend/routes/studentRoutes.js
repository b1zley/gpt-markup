const express = require('express');
const router = express.Router({ mergeParams: true });

const studentControllers = require('../controllers/studentControllers')

/**
 * @swagger
 * tags:
 *   - name: Student
 *     description: Operations related to students
 * 
 */

/**
 * @swagger
 * /student/search:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Student
 *     summary: Searches for students by student number
 *     parameters:
 *       - name: student_number_key
 *         in: query
 *         description: The student number or part of it to search for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of students matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_id:
 *                     type: integer
 *                     description: Unique identifier for the student
 *                   student_number:
 *                     type: string
 *                     description: The student number
 *                   student_name:
 *                     type: string
 *                     description: The student's name
 *       '500':
 *         description: Internal server error
 */
router.get('/search', studentControllers.handleGetRequestSearchStudent)

module.exports = router
