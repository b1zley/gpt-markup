const express = require('express');
const router = express.Router({ mergeParams: true });

const authenticationControllers = require('../controllers/authenticationControllers')

/**
 * @swagger
 * tags:
 *   - name: Super Authentication
 *     description: Operations related to authentication of super users
 * 
 */

/**
 * @swagger
 * /super_authentication/create:
 *   post:
 *     tags:
 *       - Super Authentication
 *     summary: Validates account creation code and creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               name:
 *                 type: string
 *                 description: User's name
 *               password:
 *                 type: string
 *                 description: User's password
 *               accountCreationCode:
 *                 type: string
 *                 description: Account creation code
 *     responses:
 *       '201':
 *         description: User created successfully with a validated account creation code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *                 user:
 *                   type: object
 *                   properties:
 *                     super_user_email:
 *                       type: string
 *                     super_user_name:
 *                       type: string
 *                     super_user_id:
 *                       type: integer  
 * 
 *       '401':
 *         description: Unauthorized - Invalid account creation code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 */
router.post('/create', authenticationControllers.handlePostCreateNewUserCodeValidate)


/**
 * @swagger
 * /super_authentication/login:
 *   post:
 *     tags:
 *       - Super Authentication
 *     summary: Logs in a user and returns a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *                 user:
 *                   type: object
 *                   properties:
 *                     super_user_id:
 *                       type: integer
 *                       description: Unique identifier for the user
 *                     super_user_name:
 *                       type: string
 *                       description: Name of the user
 *                     super_user_type:
 *                       type: string
 *                       description: Type of the user
 *                     super_user_email:
 *                       type: string
 *                       description: Email of the user
 *       '500':
 *         description: Internal server error
 */
router.post('/login', authenticationControllers.handlePostLogin)


/**
 * @swagger
 * /super_authentication/delete/{super_user_id}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Super Authentication
 *     summary: Deletes a super user by ID
 *     parameters:
 *       - name: super_user_id
 *         in: path
 *         description: ID of the super user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Super user deleted successfully
 *       '401':
 *         description: Unauthorized, user does not have the required permissions
 *       '500':
 *         description: Internal server error
 */
router.delete('/delete/:super_user_id', authenticationControllers.verifyJwt, authenticationControllers.handleDeleteSuperUserRequest)

module.exports = router