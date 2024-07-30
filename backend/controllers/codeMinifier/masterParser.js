const { concatenateAnyFiles, listDirectoryStructure } = require('./parseFilesConcatenate')
const fs = require('fs').promises;

// const {minifyCode} = require('./minifier')





console.log('hello from master parser start')
let startTime = performance.timeOrigin + performance.now();
let endTime

const validExtensions = ['.java']

concatenateAnyFiles('./tests/__mocks__/exampleJavaProject', validExtensions)
    .then(concatenatedFile => {
        return fs.writeFile('./tests/__mocks__/exampleJavaProjectOutputConcat.txt', concatenatedFile);
    })

// listDirectoryStructure('./tests/__mocks__/exampleJavaProject')
//     .then(dirStructure => {
//         return fs.writeFile('./tests/__mocks__/exampleJavaProjectDirStructure.txt', dirStructure);
//     })



