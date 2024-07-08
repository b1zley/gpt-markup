const fs = require('fs').promises;
const path = require('path');


const { minifyCode, removeTrailingSpacesMinify, fullMinifyCode,  } = require('./minifier')


// Function to concatenate contents of .java files in a directory
async function concatenateJavaFiles(directoryPath) {
    let concatenatedString = ''; // Initialize empty string to store concatenated data

    try {
        // Read contents of the directory
        const files = await fs.readdir(directoryPath, { withFileTypes: true });

        // Iterate through files
        for (const file of files) {

            const filePath = path.join(directoryPath, file.name);

            if (file.isDirectory()) {
                // handle as directory
                concatenatedString += await concatenateJavaFiles(filePath);
            } else if (file.isFile() && path.extname(file.name) === '.java') {
                // Read contents of .java file
                const data = await fs.readFile(filePath, 'utf8');

                // Append data to concatenated string
                concatenatedString += '-----------------\n'
                concatenatedString += `${file.name}:\n`
                // concatenatedString += removeTrailingSpacesMinify(minifyCode(data));
                // concatenatedString += data
                // minification!
                concatenatedString += fullMinifyCode(data)
                concatenatedString += '\n-----------------'
            }
        }
    } catch (err) {
        throw err; // Forward error to the caller
    }

    return concatenatedString; // Return the concatenated string
}


// Function to list directory structure asynchronously
async function listDirectoryStructure(dirPath, indentLevel = 0) {
    let structure = '';
    const indent = ' '.repeat(indentLevel * 4);  // 4 spaces per indent level
    // console.log('hello from stucture')
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(dirPath, item.name);
            const stats = await fs.stat(itemPath);

            if (stats.isDirectory()) {
                structure += `${indent}${item.name}/\n`;
                structure += await listDirectoryStructure(itemPath, indentLevel + 1);
            } else {
                structure += `${indent}${item.name}\n`;
            }
        }
    } catch (err) {
        throw err; // Forward error to the caller
    }

    return structure;
}


// Example usage: Provide the directory path containing .java files
const directoryPath = './masterFolderToParse/project1';



module.exports = { concatenateJavaFiles, listDirectoryStructure }



// concatenateJavaFiles(directoryPath)
//     .then(concatenatedString => {
//         console.log(concatenatedString)
//     })
//     .catch(err => {
//         console.error('Error:', err);
//     });