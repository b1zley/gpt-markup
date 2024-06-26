const { concatenateJavaFiles } = require('./parseFilesConcatenate')

// const {minifyCode} = require('./minifier')





console.log('hello from master parser start')
let startTime = performance.timeOrigin + performance.now();
let endTime
concatenateJavaFiles('../masterFolderToParse/P3OHaganJoshua40100099')
    .then(concatenatedFile => {
        console.log(concatenatedFile)
    })



