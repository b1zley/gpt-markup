const express = require('express');
const router = express.Router({ mergeParams: true });

const aiModelControllers = require('../controllers/aiModelControllers')

/**
 * @swagger
 * /ai_model:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Trained Model
 *     summary: Retrieves all trained models from the database
 *     responses:
 *       '200':
 *         description: A list of trained models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   model_id:
 *                     type: integer
 *                     description: Unique identifier for the trained model
 *                   model_name:
 *                     type: string
 *                     description: Name of the trained model
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the model was created
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the model was last updated
 *       '500':
 *         description: Internal server error
 */
router.get('/', aiModelControllers.getAllHandler )


module.exports = router