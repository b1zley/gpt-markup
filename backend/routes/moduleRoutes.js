const express = require('express');
const router = express.Router();

const moduleControllers = require('../controllers/moduleControllers')
const examRoutes = require('./examRoutes')

/**
 * @swagger
 * tags:
 *   - name: Module
 *     description: Operations related to modules
 * 
 */

// handle exams as subservient to modules
router.use('/:module_id/exam', examRoutes)


// module routes

/**
 * @swagger
 * /module/id:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Module
 *     summary: Retrieves a list of all module IDs
 *     responses:
 *       '200':
 *         description: List of module IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *       '500':
 *         description: Internal server error
 */
router.get('/id', moduleControllers.getAllModuleIds)

/**
 * @swagger
 * /module/{module_id}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Module
 *     summary: Retrieves data for a specific module by its ID
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: Unique identifier for the module
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Module data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 module_id:
 *                   type: integer
 *                   description: The unique identifier for the module
 *                 module_name:
 *                   type: string
 *                   description: The name of the module
 *       '500':
 *         description: Internal server error
 */
router.get('/:module_id', moduleControllers.getModuleDataByModuleId)

/**
 * @swagger
 * /module:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Module
 *     summary: Creates a new module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_name:
 *                 type: string
 *                 description: The name of the module
 *     responses:
 *       '201':
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 module_id:
 *                   type: integer
 *                   description: The unique identifier for the newly created module
 *       '500':
 *         description: Internal server error
 */
router.post('/', moduleControllers.createNewModule)


/**
 * @swagger
 * /module/:module_id/super_user_id/:super_user_id:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Module
 *     summary: Retrieves modules associated with a specific super user, optionally filtered by module ID
 *     parameters:
 *       - name: super_user_id
 *         in: path
 *         description: Unique identifier for the super user
 *         required: true
 *         schema:
 *           type: integer
 *       - name: module_id
 *         in: path
 *         description: Unique identifier for the module to filter by; use '*' to retrieve all modules
 *         required: true
 *         schema:
 *           type: string
 *           example: '*'
 *     responses:
 *       '200':
 *         description: List of modules associated with the specified super user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   module_id:
 *                     type: integer
 *                     description: The unique identifier for the module
 *                   module_name:
 *                     type: string
 *                     description: The name of the module
 *                   module_super_user_id:
 *                     type: integer
 *                     description: Module super user entry id 
 *                   super_user_id:
 *                     type: integer
 *                     description: Super user id 
 * 
 *       '500':
 *         description: Internal server error
 */
router.get('/:module_id/super_user_id/:super_user_id', moduleControllers.getModulesBySuperUserId)


/**
 * @swagger
 * /module:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Module
 *     summary: Retrieves all modules along with their associated exams
 *     responses:
 *       '200':
 *         description: List of modules with their associated exams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   module_id:
 *                     type: integer
 *                     description: Unique identifier for the module
 *                   module_name:
 *                     type: string
 *                     description: Name of the module
 *                   exams:
 *                     type: array
 *                     description: List of exams within the module
 *                     items:
 *                       type: object
 *                       properties:
 *                         exam_id:
 *                           type: integer
 *                           description: Unique identifier for the exam
 *                         exam_name:
 *                           type: string
 *                           description: Name of the exam
 *                         module_id:
 *                           type: integer
 *                           description: Unique identifier for the module            
 *                         module_name:
 *                           type: string
 *                           description: Name of the module        
 *                         exam_question:
 *                           type: string
 *                           description: Question used in the exam     
 *                         file_system_id:
 *                           type: integer
 *                           description: Unique identifier for exam's model answer in file system   
 *                         prompt_specifications:
 *                           type: string
 *                           description: AI prompt specifications for this exam       
 *                         chosen_ai_model_id:
 *                           type: integer
 *                           description: Unique identifier for AI model used for AI generation in this exam     
 *                         is_locked:              
 *                           type: integer              
 *                           description: Boolean value indicating whether or not exam has been locked            
 *                         temperature:              
 *                           type: float              
 *                           description: Decimal value of temperature used in AI generation            
 *                         top_p:              
 *                           type: float              
 *                           description: Decimal value of top_p used in AI generation            
 *                         top_p_mode:              
 *                           type: integer              
 *                           description: Boolean value indicating whether or not top_p is used in AI generation                      
 *      
 *       '500':
 *         description: Internal server error
 */
router.get('/', moduleControllers.handleGetModulesWithExams)

/**
 * @swagger
 * /module/{module_id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Module
 *     summary: Deletes a module by its ID
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: Unique identifier for the module to be deleted
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Module successfully deleted
 *       '500':
 *         description: Internal server error
 */
router.delete('/:module_id', moduleControllers.handleDeleteModuleById)

module.exports = router