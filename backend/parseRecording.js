


const fs = require('fs')
const { backendRoot } = require('./routesCommonDependencies')


function writeMessageResponseToCSV(student_exam_submission_id, responseFromApiCall) {


    let csvString = `${student_exam_submission_id},`

    // console.log(responseFromApiCall)
    responseFromApiCall.forEach((response, i) => {



        const critique = response.aiFeedbackToParse
        const mark = response.aiMarkToParse
        csvString += `"${critique}",${mark}`

        if (i < responseFromApiCall.length - 1) {
            csvString += ',';
        }

    })

    // console.log(csvString)

    const filePath = `${backendRoot}/recordOfInputs.csv`

    fs.appendFile(filePath, csvString + '\n', function (err) {
        if (err) {
            console.error('Error appending to file:', err);
        } else {
            console.log('Data successfully appended to file.');
        }
    });

}

module.exports = { writeMessageResponseToCSV }