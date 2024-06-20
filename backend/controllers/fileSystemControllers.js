const path = require('path');                // Import Path module for file path manipulations
const fs = require('fs');                    // Import File System module for file operations
const unzipper = require('unzipper');        // Import Unzipper module for extracting zip files
const yauzl = require('yauzl');

const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies



async function getFilePathsById(req, res) {
    const fileSystemId = req.params.file_system_id
    const sqlSelectQuery = `SELECT zip_file_path, unzipped_content_path FROM file_system WHERE file_system_id = ?`
    const [fileSystemRows] = await db.query(sqlSelectQuery, [fileSystemId])
    return res.status(200).json(fileSystemRows)
}


async function uploadFile(req, res) {
    const uploadType = req.body.uploadType
    console.log('hello from upload file')
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    const tempFilePath = path.join(__dirname, '../uploads', `/STAGING/${req.file.filename}`);

    // check tempZip is acceptable file size
    // if tempZipFileSize < SOME_NUMBER 
    // do rest
    // else return error
    const MAX_UNCOMPRESSED_SIZE = 50 * 1024 * 1024; // 50 MB

    try {

        // Check if the uncompressed size of the zip file is within the acceptable limit
        const tempZipFileSize = await new Promise((resolve, reject) => {
            checkZipFileSize(tempFilePath, MAX_UNCOMPRESSED_SIZE, (err, size) => {
                if (err) return reject(err);
                resolve(size);
            });
        });
        console.log(`Uncompressed size of the uploaded zip: ${tempZipFileSize} bytes`);




        const file_system_id = await handleUpload(uploadType, tempFilePath)
        return res.status(201).json(file_system_id)
    } catch (err) {
        console.log('heelo from error')
        console.log(err)

        if (err.message === 'Uncompressed size exceeds the maximum allowed limit') {
            return res.status(400).json({ message: 'File size too large' });
        }
        return res.status(500)
    }
}


/**
 * Function to handle file upload
 * @param {*} uploadType - allowable: EXAM_SUBMISSION OR EXAM_RUBRIC OR TRAINING_EXAM OR TRAINING_DATA
 * @param {*} tempFilePath - file path from multer as upload middleware - configured at multer
 */
async function handleUpload(uploadType, tempFilePath) {

    let uploadSubDirectory = ''

    switch (uploadType) {
        case 'EXAM_SUBMISSION':
            uploadSubDirectory = 'EXAM_SUBMISSION'
            break;

        case 'EXAM_RUBRIC':
            uploadSubDirectory = 'EXAM_RUBRIC'
            break;

        case 'TRAINING_DATA':
            uploadSubDirectory = 'TRAINING_DATA'
            break;

        case 'TRAINING_EXAM':
            uploadSubDirectory = 'TRAINING_EXAM'
            break;

        case 'EXAM_MODEL_ANSWER':
            uploadSubDirectory = 'EXAM_MODEL_ANSWER'
            break;

        default:
            throw new Error('Error: Disallowed Upload Type')
    }

    //create new empty entry in file_system table to ensure uniqueness
    const insertFileSystemQuery = "INSERT INTO `file_system` (`file_system_id`, `zip_file_path`, `unzipped_content_path`) VALUES (NULL, NULL, NULL);"
    const [insertResponse] = await db.query(insertFileSystemQuery)
    const insertId = insertResponse.insertId

    try {

        // rename zip file
        // const renamedFilePath = path.join(path.dirname(tempFilePath), `${insertId}`);
        const renamedFilePath = await path.join(storageDirectory, `/${uploadSubDirectory}`, `/zips/${insertId}`)
        await fs.promises.rename(tempFilePath, renamedFilePath);


        // zip file named insert id in ../uploads/zips
        const filePath = path.join(__dirname, '../uploads', `/zips/${insertId}`);
        const parentExtractPath = `../uploads/${uploadSubDirectory}/extracted`
        const processedFilePath = await processFile(renamedFilePath, parentExtractPath, insertId)
        // store in database

        const zipPathToStore = `${uploadSubDirectory}/zips/${insertId}`
        const unzippedPathToStore = `${uploadSubDirectory}/extracted/${insertId}`

        const sqlUpdateQuery = "UPDATE `file_system` SET `unzipped_content_path` = ?, `zip_file_path` = ? WHERE `file_system_id` = ?;"
        const [responseFromFileSystemUpdate] = await db.query(sqlUpdateQuery, [zipPathToStore, unzippedPathToStore, insertId])
        return ({ file_system_id: insertId })
    } catch (err) {
        console.log(err);
        await db.query('DELETE FROM `file_system` WHERE `file_system`.`file_system_id` = ?', [insertId])
        throw new Error('Error: ', err)
    }
}


/**
 * unzip target file and save into target extract folder
 * @param {} filePath - path of file to extract
 * @param {} extractPath - path to extract zip file into
 * @param {} parentExtractPath - unique folder name containing contents of zip file
 * @returns {} - path to extracted file
 */
async function processFile(filePath, parentExtractPath, insertId) {
    try {

        const extractPath = path.join(__dirname, parentExtractPath, `${insertId}`)

        await fs.promises.mkdir(extractPath, { recursive: true })

        await fs.createReadStream(filePath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .promise()

        // extract path is to be stored in database...
        return extractPath
    } catch (err) {
        return null
    }

}

async function downloadFileZipById(req, res) {
    try {
        const downloadType = req.params.download_type
        const file_system_id = req.params.file_system_id

        const fileToDownloadPath = `/${downloadType}/zips/${file_system_id}`
        const file = path.join(storageDirectory, fileToDownloadPath)
        return res.status(200).download(file)
    } catch (err) {
        return res.status(500).send()
    }
}

function checkZipFileSize(zipFilePath, maxUncompressedSize, callback) {
    let totalUncompressedSize = 0;

    yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return callback(err);

        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
            totalUncompressedSize += entry.uncompressedSize;

            // Check if the total uncompressed size exceeds the limit
            if (totalUncompressedSize > maxUncompressedSize) {
                zipfile.close();
                return callback(new Error('Uncompressed size exceeds the maximum allowed limit'));
            }

            zipfile.readEntry();
        });

        zipfile.on('end', () => {
            callback(null, totalUncompressedSize);
        });

        zipfile.on('error', (err) => {
            callback(err);
        });
    });
}






module.exports = {
    getFilePathsById,
    uploadFile,
    downloadFileZipById
}