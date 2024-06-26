


const fs = require('fs')
const { backendRoot } = require('./routesCommonDependencies')


function writeMessageResponseToCSV(student_exam_submission_id, responseFromApiCall) {

    const messages = JSON.parse(responseFromApiCall.choices[0].message.content)

    let csvString = `${student_exam_submission_id},`
    const system_fingerprint = responseFromApiCall.system_fingerprint
    // console.log(responseFromApiCall)
    // console.log(Object.keys(responseFromApiCall))
    const { TEMPERATURE, TOP_P, SEED, MODEL } = responseFromApiCall.testParameters
    console.log(responseFromApiCall)
    messages.forEach((response, i) => {



        const critique = response.aiFeedbackToParse
        const mark = response.aiMarkToParse
        csvString += `"${critique}",${mark},`

        // if (i < messages.length - 1) {
        //     csvString += ',';
        // }

    })

    csvString += `"${system_fingerprint}","${TEMPERATURE}","${TOP_P}","${SEED}","${MODEL}"`

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