const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies
const path = require('path')

const { concatenateJavaFiles, listDirectoryStructure, concatenateAnyFiles } = require('./codeMinifier/parseFilesConcatenate')

const { countTokens } = require('./tokenCounter/tokenCounter')

const { handleAiApiCall } = require('./aiApiCallHandler')

const { writeMessageResponseToCSV } = require('../parseRecording')


const { queryGetFileTypesByExamId, queryGetExamById } = require('./examControllers')



// request handlers

async function handleGetStudentExamSubmissionByExamSubmissionId(req, res) {
    try {
        const { student_exam_submission_id } = req.params
        return res.status(200).json(await queryGetExamSubmissionExamSubmissionId(student_exam_submission_id))
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}


async function handlePostCreateNewExamSubmissionEntry(req, res) {
    try {
        const { module_id, exam_id } = req.params
        const student_id = req.body.student_id
        return res.status(201).json(await queryCreateNewExamSubmission(exam_id, student_id))
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }

}

async function handleGetExamSubmissionEntryByExamId(req, res) {
    try {
        const { module_id, exam_id } = req.params
        return res.status(200).json(await queryGetExamSubmissionByExamId(exam_id))
    } catch (err) {
        return res.status(500).send()
    }
}

async function handleDeleteExamSubmissionEntryByStudentExamSubmissionId(req, res) {
    try {
        const student_exam_submission_id = req.params.student_exam_submission_id
        await queryDeleteExamSubmissionByStudentExamSubmissionId(student_exam_submission_id)
        return res.status(204).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function handlePutUpdateRubricComponentMark(req, res) {
    // rubric_component_id, student_exam_submission_id, rubric_component_mark
    try {
        const { rubric_component_id, student_exam_submission_id } = req.params
        const { rubric_component_mark } = req.body
        let updateArray = []

        for (const param in req.body) {
            let updateObject = {}
            updateObject.paramToUpdate = param
            updateObject.valueToUpdate = req.body[param]
            updateArray.push(updateObject)
        }

        await queryUpdateRubricComponentMark(rubric_component_id, student_exam_submission_id, updateArray)
        return res.status(200).send()
    } catch (err) {
        return res.status(500).send()
    }
}


async function handlePutUpdateStudentExamSubmission(req, res) {
    try {
        const { module_id, exam_id, student_exam_submission_id } = req.params
        const { file_system_id } = req.body
        let updateArray = []

        for (const param in req.body) {
            let updateObject = {}
            updateObject.paramToUpdate = param
            updateObject.valueToUpdate = req.body[param]
            updateArray.push(updateObject)
        }

        await queryUpdateStudentSubmission(student_exam_submission_id, updateArray)
        return res.status(200).send()

    } catch (err) {
        return res.status(500).send()
    }
}

// query functions

async function queryGetExamSubmissionExamSubmissionId(student_exam_submission_id) {
    const sqlQuery = "SELECT ses.student_exam_submission_id, e.exam_id, e.is_locked, s.student_id, ses.exam_submission, ses.file_system_id, m.module_id, e.exam_name, e.exam_question, e.prompt_specifications, e.chosen_ai_model_id, m.module_name, s.student_name, s.student_number FROM student_exam_submission ses LEFT JOIN exam e ON ses.exam_id = e.exam_id LEFT JOIN module m ON e.module_id = m.module_id LEFT JOIN student s ON ses.student_id = s.student_id WHERE ses.student_exam_submission_id = ?"
    const bindingParams = [student_exam_submission_id]
    const [responseFromQuery] = await db.query(sqlQuery, bindingParams)
    const examSubmission = responseFromQuery[0]


    // include rubric information here as well
    // actual marks
    // and ai marks
    const rubricComponentsAndMarksPerComponentQuery = "SELECT rc.name, rc.rubric_component_desc, rc.maximum, rc.rubric_component_id, rcsm.rubric_component_submission_mark_id, rcsm.student_exam_submission_id, rcsm.rubric_component_mark, rcsm.rubric_component_critique, rcsam.ai_mark, rcsam.ai_critique FROM student_exam_submission ses INNER JOIN exam e ON ses.exam_id = e.exam_id  INNER JOIN rubric_component rc ON rc.exam_id = e.exam_id  LEFT JOIN rubric_component_submission_mark rcsm  ON rc.rubric_component_id = rcsm.rubric_component_id AND rcsm.student_exam_submission_id = ses.student_exam_submission_id LEFT JOIN rubric_component_submission_ai_mark rcsam ON rc.rubric_component_id = rcsam.rubric_component_id AND rcsam.student_exam_submission_id = ses.student_exam_submission_id WHERE ses.student_exam_submission_id = ?"
    const rubricComponentBindingParams = [student_exam_submission_id]
    const [responseFromRubricQuery] = await db.query(rubricComponentsAndMarksPerComponentQuery, rubricComponentBindingParams)

    examSubmission.rubric = responseFromRubricQuery

    for (let i = 0; i < examSubmission.rubric.length; i++) {
        const ratingRangeSql = 'SELECT * FROM rating_range WHERE rubric_component_id = ?'
        const ratingRangeBindingParams = [responseFromRubricQuery[i].rubric_component_id]
        const [responseFromRatingRange] = await db.query(ratingRangeSql, ratingRangeBindingParams)
        examSubmission.rubric[i].rating_ranges = responseFromRatingRange
    }

    return examSubmission

}


// async function queryGetRubricInformationByExamSubmissionId

async function queryCreateNewExamSubmission(exam_id, student_id) {
    const sqlQuery = "INSERT INTO `student_exam_submission` (`student_exam_submission_id`, `exam_id`, `student_id`, `exam_submission`, `file_system_id`) VALUES (NULL, ?, ?, NULL,  NULL);"
    const bindingParams = [exam_id, student_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    const student_exam_submission_id = responseFromInsert.insertId
    return { student_exam_submission_id }
}

async function queryGetExamSubmissionByExamId(exam_id) {
    // need to also calculate total agreed mark...

    const sqlQuery = "SELECT ses.student_exam_submission_id, ses.marked_for_training, ses.exam_id, ses.student_id, ses.exam_submission, COALESCE(SUM(rcsm.rubric_component_mark), NULL) AS marker_mark, ses.file_system_id, student.student_name, student.student_number FROM student_exam_submission ses LEFT JOIN rubric_component_submission_mark rcsm ON ses.student_exam_submission_id = rcsm.student_exam_submission_id INNER JOIN student ON student.student_id = ses.student_id WHERE exam_id = ? GROUP BY ses.student_exam_submission_id, ses.student_id, ses.exam_id"
    const bindingParams = [exam_id]

    const [queryResponse] = await db.query(sqlQuery, bindingParams)

    return queryResponse
}



async function queryDeleteExamSubmissionByStudentExamSubmissionId(student_exam_submission_id) {
    const sqlQuery = 'DELETE FROM student_exam_submission WHERE `student_exam_submission`.`student_exam_submission_id` = ?'
    const bindingParams = [student_exam_submission_id]
    const [responseFromDeleteQuery] = await db.query(sqlQuery, bindingParams)
    return true
}


async function queryUpdateRubricComponentMark(rubric_component_id, student_exam_submission_id, updateArray) {

    const sqlQueryFindCurrent = 'SELECT * FROM rubric_component rc INNER JOIN rubric_component_submission_mark rcsm ON rc.rubric_component_id = rcsm.rubric_component_id WHERE rc.rubric_component_id = ? AND rcsm.student_exam_submission_id = ?'
    const bindingParams = [rubric_component_id, student_exam_submission_id]
    const [responseFromFindCurrent] = await db.query(sqlQueryFindCurrent, bindingParams)

    if (responseFromFindCurrent.length === 0) {
        // create new
        const insertSqlQuery = `INSERT INTO rubric_component_submission_mark (rubric_component_submission_mark_id, student_exam_submission_id, rubric_component_id, ${updateArray[0].paramToUpdate}) VALUES (NULL, ?, ?, ?);`
        const insertBindingParams = [student_exam_submission_id, rubric_component_id, updateArray[0].valueToUpdate]
        const [responseFromUpdateQuery] = await db.query(insertSqlQuery, insertBindingParams)
        return true
    } else {
        // update current
        const { rubric_component_submission_mark_id } = responseFromFindCurrent[0]
        const bindingParams = [updateArray[0].valueToUpdate, rubric_component_submission_mark_id]
        const updateSqlQuery = `UPDATE rubric_component_submission_mark SET ${updateArray[0].paramToUpdate} = ? WHERE rubric_component_submission_mark.rubric_component_submission_mark_id = ?`
        const [responseFromUpdateQuery] = await db.query(updateSqlQuery, bindingParams)
        return true
    }
}



async function queryUpdateStudentSubmission(student_exam_submission_id, updateArray) {
    const validColumnNames = await queryGetColumnsStudentExamSubmission()
    let sqlQuery = 'UPDATE student_exam_submission SET '
    let bindingParams = []

    updateArray.forEach((updateObject, i) => {
        if (!validColumnNames.includes(updateObject.paramToUpdate)) {
            throw new Error('Invalid column update...')
        }
        sqlQuery += `${updateObject.paramToUpdate} = ?`
        bindingParams.push(updateObject.valueToUpdate)
        if (i < updateArray.length - 1) {
            sqlQuery += ','
        }
        sqlQuery += ' '
    })

    sqlQuery += ' WHERE student_exam_submission_id = ?'
    bindingParams.push(student_exam_submission_id)

    const [responseFromUpdate] = await db.query(sqlQuery, bindingParams)

    return true

}


async function queryGetColumnsStudentExamSubmission() {
    const sqlQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'gpt_markup' AND TABLE_NAME = 'student_exam_submission'"
    const [responseFromQuery] = await db.query(sqlQuery)

    const columnNames = responseFromQuery.map((row) => row.COLUMN_NAME)
    return columnNames

}

// handle new ai critique generation
async function handlePostGetNewAICritique(req, res) {
    try {

        const { student_exam_submission_id, exam_id } = req.params

        
        // check if exam is locked
        const examInformation = await queryGetExamById(exam_id)

        if(examInformation.is_locked != 1){
            throw new Error('Exam not locked')
        }
        // get new ai critique from ai
        // return entire new student exam submission object?
        await getNewAICritique(student_exam_submission_id)
        return res.status(201).json(await queryGetExamSubmissionExamSubmissionId(student_exam_submission_id))

    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }


}

async function handleMarkSESForTraining(req, res) {
    try {
        const { student_exam_submission_id } = req.params
        const updateStatus = await queryMarkSESForTraining(student_exam_submission_id)
        return res.status(200).send()
    } catch (err) {
        return res.status(500).send()
    }
}


async function handleUnmarkSESForTraining(req, res) {
    try {
        const { student_exam_submission_id } = req.params
        const responseFromUpdate = await queryUnmarkSESForTraining(student_exam_submission_id)
        return res.status(200).send()
    } catch (err) {
        return res.status(500).send()
    }
}

// query handlers

async function getExamInformationForAiParse(student_exam_submission_id) {
    // aggregate data of interest

    // JUST EXAM INFO HERE.
    const examSqlQuery = "SELECT e.exam_id, e.exam_name, e.exam_question, e.prompt_specifications, m.module_id, m.module_name, fs.file_system_id, fs.zip, fs.unzip, tm.trained_model_id, tm.api_id, tm.prompt_engineering, tm.model_name FROM student_exam_submission ses INNER JOIN exam e ON ses.exam_id = e.exam_id INNER JOIN module m on e.module_id = m.module_id INNER JOIN trained_model tm ON e.chosen_ai_model_id = tm.trained_model_id INNER JOIN file_system fs ON e.file_system_id = fs.file_system_id WHERE ses.student_exam_submission_id = ?"
    const examBindingParams = [student_exam_submission_id]

    const [responseFromExamQuery] = await db.query(examSqlQuery, examBindingParams)
    const examInformation = responseFromExamQuery[0]
    // console.log(responseFromExamQuery)
    // console.log(examInformation)

    // rubric components with exam
    const rubricSqlQuery = "SELECT rc.rubric_component_id, rc.name, rc.rubric_component_desc, rc.maximum FROM exam e INNER JOIN rubric_component rc ON e.exam_id = rc.exam_id WHERE e.exam_id = ?"
    const rubricBindingParams = [examInformation.exam_id]
    const [rubricComponentArray] = await db.query(rubricSqlQuery, rubricBindingParams)

    // rating ranges within rubric components
    for (const rubricComponent of rubricComponentArray) {
        const ratingRangeBindingParams = [rubricComponent.rubric_component_id]
        const ratingRangeSql = "SELECT rr.* FROM rubric_component rc INNER JOIN rating_range rr ON rr.rubric_component_id = rc.rubric_component_id WHERE rc.rubric_component_id = ?"
        const [ratingRangeArray] = await db.query(ratingRangeSql, ratingRangeBindingParams)
        rubricComponent.rating_ranges = ratingRangeArray
    }

    examInformation.rubric = rubricComponentArray


    // get allowed file types in exam
    examInformation.fileTypes = await getExtensionsArrayExamId(examInformation.exam_id)
    return examInformation
}

async function getExtensionsArrayExamId(exam_id){
    rawFileTypeArray = await queryGetFileTypesByExamId(exam_id)
    return rawFileTypeArray.map((fileType) => fileType.allowed ? `.${fileType.file_type_extension}` : null).filter((element) => element !== null)
}

async function getNewAICritique(student_exam_submission_id) {

    let examInformation = await getExamInformationForAiParse(student_exam_submission_id)

    const { exam_id } = examInformation
    // console.log('exam_id', exam_id)


    const markedSubmissions = await queryGetStudentExamSubmissionsMarkedForTraining(exam_id)
    // console.log(markedSubmissions)

    // parse model answer as well
    const modelAnswerPath = path.join(storageDirectory, examInformation.unzip)
    // console.log('start concat any...')
    const parsedModelAnswer = await concatenateAnyFiles(modelAnswerPath, examInformation.fileTypes)
    // console.log('end concat any')
    examInformation.model_answer = parsedModelAnswer

    // console.log(examInformation.fileTypes)
    parsedSubmissionAnswer = await getParsedSubmissionAnswerBySESId(student_exam_submission_id, examInformation.fileTypes)

    // console.log(parsedSubmissionAnswer)

    // console.log(countTokens(parsedSubmissionAnswer))

    // get path to submission data
    // and fake parsing file
    /**
     * simulate for now!!!
     */
    // send all this shit to the api

    const informationToSendToLLM = {
        examInformation,
        submissionText: parsedSubmissionAnswer,
        markedSubmissions
    }

    // console.log(Object.keys(examInformation))

    // console.log(examInformation.model_answer)
    // console.log(informationToSendToLLM.submissionText)
    // console.log(markedSubmissions[0].submissionText)

    const responseFromApiCall = await handleAiApiCall(informationToSendToLLM, student_exam_submission_id)

    // const parameterizedAiMessage = JSON.parse(responseFromApiCall.choices[0].message.content)
    const parameterizedAiMessage = responseFromApiCall.content

    // writeMessageResponseToCSV(student_exam_submission_id, responseFromApiCall)
    // simulate response
    // should respond with mark and critique for each rubric component id

    let responseArray = []
    informationToSendToLLM.examInformation.rubric.forEach((rubricComponent, i) => {


        const aiObject = {
            rubric_component_id: rubricComponent.rubric_component_id,
            model_id_used: examInformation.trained_model_id,
            ai_critique: parameterizedAiMessage[i].aiFeedbackToParse,
            ai_mark: parameterizedAiMessage[i].aiMarkToParse
        }
        // console.log(`this is aiobject ${i}`)
        // console.log(aiObject)
        responseArray.push(aiObject)
    })


    // insert response into appropriate db tables
    // rubric component submission ai mark
    for (const responseElement of responseArray) {
        const { rubric_component_id, model_id_used, ai_critique, ai_mark } = responseElement
        await queryInsertOrUpdateAiMark(student_exam_submission_id, rubric_component_id, model_id_used, ai_critique, ai_mark)
    }

    return responseArray

}


async function queryInsertOrUpdateAiMark(student_exam_submission_id, rubric_component_id, model_id_used, ai_critique, ai_mark) {

    const sqlSelectCurrentAiMark = "SELECT rcsam.rubric_component_submission_ai_mark_id FROM rubric_component_submission_ai_mark rcsam WHERE rcsam.rubric_component_id = ? AND rcsam.student_exam_submission_id = ?"
    const currentAiMarkBindingParams = [rubric_component_id, student_exam_submission_id]
    const [repsonseFromAiMarkSelect] = await db.query(sqlSelectCurrentAiMark, currentAiMarkBindingParams)

    if (repsonseFromAiMarkSelect.length === 0) {
        // do insert
        const insertSql = "INSERT INTO `rubric_component_submission_ai_mark` (`rubric_component_submission_ai_mark_id`, `ai_mark`, `ai_critique`, `student_exam_submission_id`, `trained_model_id`, `rubric_component_id`) VALUES (NULL, ?, ?, ?, ?, ?);"
        const insertBindingParams = [ai_mark, ai_critique, student_exam_submission_id, model_id_used, rubric_component_id]
        const [responseFromInsert] = await db.query(insertSql, insertBindingParams)
    } else {
        // do update
        const rubric_component_submission_ai_mark_id = repsonseFromAiMarkSelect[0].rubric_component_submission_ai_mark_id
        const updateSql = "UPDATE rubric_component_submission_ai_mark  SET  ai_critique = ?, ai_mark = ?, trained_model_id = ?, rubric_component_id = ? WHERE rubric_component_submission_ai_mark.rubric_component_submission_ai_mark_id = ?;"
        const updateBindingParams = [ai_critique, ai_mark, model_id_used, rubric_component_id, rubric_component_submission_ai_mark_id]
        const [responseFromUpdate] = await db.query(updateSql, updateBindingParams)
    }

}


async function getParsedSubmissionAnswerBySESId(student_exam_submission_id, extensions) {
    // submission data
    const submissionDataSql = "SELECT fs.* FROM student_exam_submission ses INNER JOIN file_system fs ON ses.file_system_id = fs.file_system_id WHERE ses.student_exam_submission_id = ?"
    const submissionBindingParams = [student_exam_submission_id]

    const [responseFromSubmissionQuery] = await db.query(submissionDataSql, submissionBindingParams)
    const submissionDataPath = responseFromSubmissionQuery[0]

    // parse submission data
    const submissionAnswerPath = path.join(storageDirectory, submissionDataPath.unzip)

    let parsedSubmissionAnswer = 'File Structure:\n'
    parsedSubmissionAnswer += await listDirectoryStructure(submissionAnswerPath)
    parsedSubmissionAnswer += '\n'
    parsedSubmissionAnswer += await concatenateAnyFiles(submissionAnswerPath, extensions)


    return parsedSubmissionAnswer
}


async function queryGetStudentExamSubmissionsMarkedForTraining(exam_id) {


    const sqlQuery = "SELECT ses.student_exam_submission_id FROM student_exam_submission ses WHERE ses.exam_id = ? AND ses.marked_for_training = 1"
    const bindingParams = [exam_id]

    const [responseFromQuery] = await db.query(sqlQuery, bindingParams)
    const markedStudentExamSubmissionIds = responseFromQuery.map(row => row.student_exam_submission_id)
    // console.log(markedStudentExamSubmissionIds)

    // must create an 'example object'

    const extensions = await getExtensionsArrayExamId(exam_id)

    let markedExamSubmissions = []
    for (const ses_id of markedStudentExamSubmissionIds) {

        const submissionText = await getParsedSubmissionAnswerBySESId(ses_id, extensions)
        const rubricMarkArray = await getRubricMarkArraySESId(ses_id)


        const exampleObject = {
            submissionText,
            rubricMarkArray
        }
        markedExamSubmissions.push(exampleObject)
    }
    return markedExamSubmissions
}

async function getRubricMarkArraySESId(student_exam_submission_id) {
    const sqlQuery = "SELECT * FROM rubric_component_submission_mark rcsm WHERE rcsm.student_exam_submission_id = ? ORDER BY rcsm.rubric_component_id"
    const bindingParams = [student_exam_submission_id]

    const [response] = await db.query(sqlQuery, bindingParams)
    const markArray = response.map((row) => {
        return {
            mark: row.rubric_component_mark,
            critique: row.rubric_component_critique,
            rubric_component_id: row.rubric_component_id
        }
    })
    return markArray
}


async function queryMarkSESForTraining(student_exam_submission_id) {
    const sqlQuery = "UPDATE `student_exam_submission` SET `marked_for_training` = '1' WHERE `student_exam_submission`.`student_exam_submission_id` = ?;"
    const bindingParams = [student_exam_submission_id]

    const [responseFromQuery] = await db.query(sqlQuery, bindingParams)

    return responseFromQuery.changedRows > 0

}

async function queryUnmarkSESForTraining(student_exam_submission_id) {
    const sqlQuery = "UPDATE `student_exam_submission` SET `marked_for_training` = NULL WHERE `student_exam_submission`.`student_exam_submission_id` = ?;"
    const bindingParams = [student_exam_submission_id]
    const [responseFromUpdate] = await db.query(sqlQuery, bindingParams)
    return responseFromUpdate.changedRows > 0
}


module.exports = {
    handlePostCreateNewExamSubmissionEntry,
    handleGetExamSubmissionEntryByExamId,
    handleDeleteExamSubmissionEntryByStudentExamSubmissionId,
    handleGetStudentExamSubmissionByExamSubmissionId,
    handlePutUpdateRubricComponentMark,
    handlePutUpdateStudentExamSubmission,
    handlePostGetNewAICritique,
    handleMarkSESForTraining,
    handleUnmarkSESForTraining
}