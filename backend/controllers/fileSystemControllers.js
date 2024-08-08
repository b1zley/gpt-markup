const path = require('path');                // Import Path module for file path manipulations
const fs = require('fs');                    // Import File System module for file operations
const unzipper = require('unzipper');        // Import Unzipper module for extracting zip files
const yauzl = require('yauzl');
const { performance } = require('perf_hooks');
const { db, axios, backendRoot, storageDirectory} = require('../routesCommonDependencies'); // Common dependencies



async function getFilePathsById(req, res) {
    const fileSystemId = req.params.file_system_id
    const sqlSelectQuery = `SELECT unzip, zip FROM file_system WHERE file_system_id = ?`
    const [fileSystemRows] = await db.query(sqlSelectQuery, [fileSystemId])
    return res.status(200).json(fileSystemRows)
}


async function uploadFile(req, res) {
    const uploadType = req.body.uploadType;
    // console.log('hello from upload file');
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    // console.log(storageDirectory)
    const tempFilePath = path.join(storageDirectory, 'STAGING', req.file.filename);
    // console.log(tempFilePath)

    const MAX_UNCOMPRESSED_SIZE = 50 * 1024 * 1024; // 50 MB

    try {
        const tempZipFileSize = await new Promise((resolve, reject) => {
            checkZipFileSize(tempFilePath, MAX_UNCOMPRESSED_SIZE, (err, size) => {
                if (err) return reject(err);
                resolve(size);
            });
        });

        const file_system_id = await handleUpload(uploadType, tempFilePath);
        return res.status(201).json(file_system_id);
    } catch (err) {
        // console.error('Error during upload:', err);

        if (err.message === 'Uncompressed size exceeds the maximum allowed limit') {
            return res.status(400).json({ message: 'File size too large' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function handleUpload(uploadType, tempFilePath) {
    let uploadSubDirectory = '';

    switch (uploadType) {
        case 'EXAM_SUBMISSION':
            uploadSubDirectory = 'EXAM_SUBMISSION';
            break;
        case 'EXAM_MODEL_ANSWER':
            uploadSubDirectory = 'EXAM_MODEL_ANSWER';
            break;
        default:
            throw new Error('Error: Disallowed Upload Type');
    }

    const insertFileSystemQuery = "INSERT INTO `file_system` (`file_system_id`, `unzip`, `zip`) VALUES (NULL, NULL, NULL);"
    const [insertResponse] = await db.query(insertFileSystemQuery);
    const insertId = insertResponse.insertId;

    try {

        const renamedFilePath = path.join(storageDirectory, uploadSubDirectory, 'zips', `${insertId}`);
        await fs.promises.rename(tempFilePath, renamedFilePath);

        const parentExtractPath = path.join(storageDirectory, uploadSubDirectory, 'extracted');
        const processedFilePath = await processFile(renamedFilePath, parentExtractPath, insertId);

        const zipPathToStore = path.join(uploadSubDirectory, 'zips', `${insertId}`);
        const unzippedPathToStore = path.join(uploadSubDirectory, 'extracted', `${insertId}`);

        const sqlUpdateQuery = "UPDATE `file_system` SET `zip` = ?, `unzip` = ? WHERE `file_system_id` = ?;";
        await db.query(sqlUpdateQuery, [zipPathToStore, unzippedPathToStore, insertId]);
        return { file_system_id: insertId };
    } catch (err) {
        // console.error('Error during file handling:', err);
        await db.query('DELETE FROM `file_system` WHERE `file_system`.`file_system_id` = ?', [insertId]);
        throw new Error('Error during file handling');
    }
}

async function processFile(filePath, parentExtractPath, insertId) {
    try {
        const extractPath = path.join(parentExtractPath, `${insertId}`);
        await fs.promises.mkdir(extractPath, { recursive: true });

        // console.log(`Extracting ${filePath} to ${extractPath}`);

        const directory = await unzipper.Open.file(filePath)
        await directory.extract({path:extractPath})
        // await fs.createReadStream(filePath)
        //     .pipe(unzipper.Extract({ path: extractPath }))
        //     .promise();

        // console.log(`Extracted files to: ${extractPath}`);
        // await logDirectoryStructure(extractPath); // Log the structure of the extracted files

        return extractPath;
    } catch (err) {
        // console.error('Error during file extraction:', err);
        return null;
    }
}

async function logZipContents(zipFilePath) {
    try {
        // console.log(`Contents of zip file ${zipFilePath}:`);
        const directory = await unzipper.Open.file(zipFilePath);
        directory.files.forEach(file => {
            // console.log(file.path);
        });
    } catch (err) {
        // console.error('Error reading zip file contents:', err);
    }
}

async function logDirectoryStructure(directoryPath) {
    // console.log(`Directory structure for ${directoryPath}:`);
    async function logStructure(dir, indent = '') {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(dir, file.name);
            // console.log(`${indent}${file.name} (${filePath.length} characters)`);
            if (file.isDirectory()) {
                await logStructure(filePath, indent + '  ');
            }
        }
    }
    await logStructure(directoryPath);
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