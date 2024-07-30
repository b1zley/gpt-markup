const express = require('express');
const router = express.Router();

const superUserControllers = require('../controllers/superUserControllers')

/**
 * @swagger
 * tags:
 *   - name: Super User
 *     description: Operations related to Super Users
 * 
 */


/**
 * @swagger
 * /super_user:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Super User
 *     summary: Retrieves all super users in the database
 *     responses:
 *       '200':
 *         description: Array of super user objects
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          super_user_id:
 *                             type: integer
 *                             description: Unique identifier for super user
 *                          super_user_name:
 *                            type: string
 *                            description: Name for super user
 *                          super_user_type_name:
 *                            type: string
 *                            description: Type of super user
 *                          access_rights:
 *                            type: string
 *                            description: Access rights for super user
 *                          
 */
router.get('/', superUserControllers.getAllSuperUsers)



/**
 * @swagger
 * /super_user/exam_search:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Super User
 *     summary: Retrieves all super users with access rights for given exam
 *     parameters:
 *       - name: module_id 
 *         in: query
 *         description: Id of module to be searched across
 *         required: true
 *         schema:
 *           type: string
 *       - name: exam_id 
 *         in: query
 *         description: Id of exam to be searched across
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of super user objects
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          super_user_id:
 *                             type: integer
 *                             description: Unique identifier for super user
 *                          super_user_name:
 *                            type: string
 *                            description: Name for super user
 *                          super_user_type_name:
 *                            type: string
 *                            description: Type of super user
 *                          super_user_type_id:
 *                            type: integer
 *                            description: Type of super user id
 *                          access_rights:
 *                            type: string
 *                            description: Access rights for super user
 *                          
 */
router.get('/exam_search', superUserControllers.getExamAccessSuperUsersByQueryParams)



/**
 * @swagger
 * /super_user/super_user_type_id/:super_user_type_id:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Super User
 *     summary: Retrieves all super users of specific user type id
 *     parameters:
 *       - name: super_user_type_id 
 *         in: path
 *         description: Id of super_user_type to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of super user objects
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          super_user_id:
 *                             type: integer
 *                             description: Unique identifier for super user
 *                          super_user_name:
 *                            type: string
 *                            description: Name for super user
 *                          super_user_type_name:
 *                            type: string
 *                            description: Type of super user
 *                          super_user_type_id:
 *                            type: integer
 *                            description: Type of super user id
 *                          access_rights:
 *                            type: string
 *                            description: Access rights for super user
 *                          
 */
router.get('/super_user_type_id/:super_user_type_id/', superUserControllers.requestHandlerGetSuperUserBySuperUserType)




/**
 * @swagger
 * /super_user/module/:module_id:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Super User
 *     summary: Retrieves all super users with access to specific module
 *     parameters:
 *       - name: module_id 
 *         in: path
 *         description: Id of module_id to search across
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of super user objects
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          super_user_id:
 *                             type: integer
 *                             description: Unique identifier for super user
 *                          super_user_name:
 *                            type: string
 *                            description: Name for super user
 *                          super_user_type_name:
 *                            type: string
 *                            description: Type of super user
 *                          super_user_type_id:
 *                            type: integer
 *                            description: Type of super user id
 *                          super_user_email:
 *                            type: string
 *                            description: Email address for super user
 *                          
 */
router.get('/module/:module_id', superUserControllers.requestHandlerGetLecturerModuleAccess)


/**
 * @swagger
 * /super_user/module/:module_id/lecturer/:super_user_id:
 *   delete:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Super User
 *     summary: Removes super user's access to a given module
 *     parameters:
 *       - name: super_user_id 
 *         in: path
 *         description: Id of super_user to remove access
 *         required: true
 *         schema:
 *           type: string
 *       - name: module_id 
 *         in: path
 *         description: Id of module to remove access
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: No content
 *                          
 */
router.delete('/module/:module_id/lecturer/:super_user_id', superUserControllers.requestHandlerDeleteLecturerModuleAccess)

/**
 * @swagger
 * /super_user/module/:module_id/lecturer:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Super User
 *     summary: Adds a super user to a module
 *     parameters:
 *       - name: module_id
 *         in: path
 *         description: Id of module to add access
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               super_user_id:
 *                 type: integer
 *                 description: Id of super user to add
 *     responses:
 *       '201':
 *         description: Super user successfully added to module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 super_user_id:
 *                   type: integer
 *                   description: Unique identifier for super user
 */
router.post('/module/:module_id/lecturer', superUserControllers.handlePostLecturerToModule)

module.exports = router