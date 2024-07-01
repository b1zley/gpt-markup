


const fs = require('fs')
const { backendRoot } = require('./routesCommonDependencies')

/**
 * 
 * @param {} student_exam_submission_id 
 * @param {*} responseFromApiCall - messages array + testparameters
 * {messages: [], testParameters}
 */
function writeMessageResponseToCSV(student_exam_submission_id, responseFromApiCall) {

    const messages = responseFromApiCall.content

    let csvString = `${student_exam_submission_id},`
    // const system_fingerprint = responseFromApiCall.system_fingerprint
    // console.log(responseFromApiCall)
    // console.log(Object.keys(responseFromApiCall))
    const { TEMPERATURE, TOP_P, SEED, MODEL, system_fingerprint } = responseFromApiCall.testParameters
    console.log(responseFromApiCall)
    messages.forEach((response, i) => {



        const critique = response.aiFeedbackToParse
        const mark = response.aiMarkToParse
        csvString += `${escapeCSV(critique)},"${escapeCSV(mark)}",`

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


function escapeCSV(field) {
    if (field === null || field === undefined) {
      return '';
    }
    field = String(field);
    // Replace all line breaks with space
    field = field.replace(/\r?\n|\r/g, ' ');
    // If the field contains comma, double quote, or semicolon, wrap it in quotes
    if (field.includes('"') || field.includes(',') || field.includes(';')) {
      // Double up any double quotes
      field = field.replace(/"/g, '""');
      return `"${field}"`;
    }
    return field;
  }


function writeClaudeMessageResponseToCSV(student_exam_submission_id, claudeResponse){
    console.log('hello from claude ^.^')
}

module.exports = { writeMessageResponseToCSV, writeClaudeMessageResponseToCSV }