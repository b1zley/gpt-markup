const express = require('express');
const router = express.Router();
const multer = require('multer');            // Import Multer middleware for handling file uploads
const path = require('path');                // Import Path module for file path manipulations

const { storageDirectory } = require('../routesCommonDependencies')

// Configure Multer to store uploaded files in the 'uploads/' directory
// upload path must depend on node env

const environment = process.env.NODE_ENV;
let upload;

if (environment === 'test') {
    upload = multer({ dest: path.join(__dirname, '../testUploads/STAGING') }); // Corrected destination directory path
} else {
    upload = multer({ dest: path.join(__dirname, '../uploads/STAGING') }); // Corrected destination directory path
}

// file system controller import
const fileSystemController = require('../controllers/fileSystemControllers')


/**
 * @swagger
 * tags:
 *   - name: File System
 *     description: Operations related to the File System
 * 
 */



/**
 * @swagger
 * /file_system/upload:
 *   post:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - File System
 *     summary: Uploads a file to the file system
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uploadType:
 *                 type: string
 *                 description: Name of the upload type
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       '201':
 *         description: Returns created file_system_id
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          file_system_id:
 *                             type: integer
 *                             description: Unique identifier for location in file_system
 *       '400':
 *         description: File size too large
 *       '500':                      
 *         description: Internal Server Error                
 */
router.post('/upload', upload.single('file'), fileSystemController.uploadFile);

/**
 * @swagger
 * /file_system/:file_system_id:
 *   get:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - File System
 *     summary: Retrieves information on accessing an entry in the file system
 *     parameters:
 *       - name: file_system_id 
 *         in: path
 *         description: Id of file to access
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns created file_system_id
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          unzip:
 *                             type: string
 *                             description: Unzip file location within file system
 *                          zip:
 *                             type: string
 *                             description: Zip file location within file system
 *                          
 *                          
 */
router.get('/:file_system_id', fileSystemController.getFilePathsById)

/**
 * @swagger
 * /file_system/download_zip/:download_type/:file_system_id:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - File System
 *     summary: Downloads a ZIP file from the file system based on provided IDs
 *     parameters:
 *       - name: download_type
 *         in: path
 *         description: Type of download (e.g., 'documents', 'images')
 *         required: true
 *         schema:
 *           type: string
 *       - name: file_system_id
 *         in: path
 *         description: Unique identifier for the file to be downloaded
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully downloads the ZIP file
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *       '400':
 *         description: Bad request, invalid parameters
 *       '404':
 *         description: File not found
 *       '500':
 *         description: Internal server error
 */
router.get('/download_zip/:download_type/:file_system_id', fileSystemController.downloadFileZipById)

module.exports = router;
