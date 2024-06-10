const express = require('express');
const router = express.Router();
const multer = require('multer');            // Import Multer middleware for handling file uploads
const path = require('path');                // Import Path module for file path manipulations

// Configure Multer to store uploaded files in the 'uploads/' directory
const upload = multer({ dest: path.join(__dirname, '../uploads/STAGING') }); // Corrected destination directory path

// file system controller import
const fileSystemController = require('../controllers/fileSystemControllers')

/**
 * Route for zip file upload, unzipping, storage, referencing within database
 */
router.post('/upload', upload.single('file'), fileSystemController.uploadFile);

/**
 * @param - file_system_id - id to find paths of
 * returns json with relative path to zip file and path to unzipped file from data storage directory of application
 */
router.get('/:file_system_id', fileSystemController.getFilePathsById)


router.get('/download_zip/:download_type/:file_system_id', fileSystemController.downloadFileZipById)

module.exports = router;
