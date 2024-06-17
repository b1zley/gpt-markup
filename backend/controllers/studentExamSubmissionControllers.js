const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

// request handlers

async function handleGetStudentExamSubmissionByExamSubmissionId(req, res) {
    try {
        const { student_exam_submission_id } = req.params
        return res.status(200).json(await queryGetExamSubmissionExamSubmissionId(student_exam_submission_id))
    } catch (err) {
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
        await queryUpdateRubricComponentMark(rubric_component_id, student_exam_submission_id, rubric_component_mark)
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
    console.log(student_exam_submission_id)
    console.log('hello from query get exam submission')
    const sqlQuery = "SELECT ses.student_exam_submission_id, e.exam_id, s.student_id, ses.exam_submission, ses.marker_mark, ses.marker_critique, ses.file_system_id, ses.ai_critique_id, m.module_id, e.exam_name, e.exam_question, e.model_answer, e.prompt_specifications, e.chosen_ai_model_id, m.module_name, s.student_name, s.student_number, aic.ai_mark, aic.ai_critique_id, aic.ai_critique, aic.time_generated, aic.model_generated_by_id, tm.trained_model_id, tm.api_id, tm.prompt_engineering, tm.model_name FROM student_exam_submission ses LEFT JOIN exam e ON ses.exam_id = e.exam_id LEFT JOIN module m ON e.module_id = m.module_id LEFT JOIN student s ON ses.student_id = s.student_id LEFT JOIN ai_critique aic ON ses.ai_critique_id = aic.ai_critique_id LEFT JOIN trained_model tm ON aic.model_generated_by_id = tm.trained_model_id WHERE ses.student_exam_submission_id = ?"
    const bindingParams = [student_exam_submission_id]
    const [responseFromQuery] = await db.query(sqlQuery, bindingParams)
    const examSubmission = responseFromQuery[0]

    console.log(sqlQuery)
    console.log(bindingParams)
    console.log(examSubmission)

    // include rubric information here as well
    const rubricComponentsAndMarksPerComponentQuery = "SELECT rc.name, rc.rubric_component_desc, rc.maximum, rc.rubric_component_id, rcsm.rubric_component_submission_mark_id, rcsm.student_exam_submission_id, rcsm.rubric_component_mark FROM student_exam_submission ses LEFT JOIN exam e ON ses.exam_id = e.exam_id LEFT JOIN rubric_component rc ON rc.exam_id = e.exam_id LEFT JOIN rubric_component_submission_mark rcsm ON ses.student_exam_submission_id = rcsm.student_exam_submission_id WHERE ses.student_exam_submission_id = ? GROUP BY rc.rubric_component_id"
    const rubricComponentBindingParams = [student_exam_submission_id]

    const [responseFromRubricQuery] = await db.query(rubricComponentsAndMarksPerComponentQuery, rubricComponentBindingParams)

    examSubmission.rubric = responseFromRubricQuery

    // console.log(examSubmission)
    return examSubmission

}


// async function queryGetRubricInformationByExamSubmissionId

async function queryCreateNewExamSubmission(exam_id, student_id) {
    const sqlQuery = "INSERT INTO `student_exam_submission` (`student_exam_submission_id`, `exam_id`, `student_id`, `exam_submission`, `marker_mark`, `marker_critique`, `file_system_id`, `ai_critique_id`) VALUES (NULL, ?, ?, NULL, NULL, NULL, NULL, NULL);"
    const bindingParams = [exam_id, student_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    const student_exam_submission_id = responseFromInsert.insertId
    return { student_exam_submission_id }
}

async function queryGetExamSubmissionByExamId(exam_id) {
    // need to also calculate total agreed mark...

    const sqlQuery = "SELECT ses.student_exam_submission_id, ses.exam_id, ses.student_id, ses.exam_submission, COALESCE(SUM(rcsm.rubric_component_mark), NULL) AS marker_mark, ses.file_system_id, ses.ai_critique_id, student.student_name, student.student_number FROM student_exam_submission ses LEFT JOIN rubric_component_submission_mark rcsm ON ses.student_exam_submission_id = rcsm.student_exam_submission_id INNER JOIN student ON student.student_id = ses.student_id WHERE exam_id = ? GROUP BY ses.student_exam_submission_id, ses.student_id, ses.exam_id"
    const bindingParams = [exam_id]

    const [queryResponse] = await db.query(sqlQuery, bindingParams)

    return queryResponse
}



async function queryDeleteExamSubmissionByStudentExamSubmissionId(student_exam_submission_id) {
    console.log(student_exam_submission_id)
    const sqlQuery = 'DELETE FROM student_exam_submission WHERE `student_exam_submission`.`student_exam_submission_id` = ?'
    const bindingParams = [student_exam_submission_id]
    const [responseFromDeleteQuery] = await db.query(sqlQuery, bindingParams)
    return true
}


async function queryUpdateRubricComponentMark(rubric_component_id, student_exam_submission_id, rubric_component_mark) {

    const sqlQueryFindCurrent = 'SELECT * FROM rubric_component rc INNER JOIN rubric_component_submission_mark rcsm ON rc.rubric_component_id = rcsm.rubric_component_id WHERE rc.rubric_component_id = ? AND rcsm.student_exam_submission_id = ?'
    const bindingParams = [rubric_component_id, student_exam_submission_id]
    const [responseFromFindCurrent] = await db.query(sqlQueryFindCurrent, bindingParams)
    console.log(responseFromFindCurrent)

    if (responseFromFindCurrent.length === 0) {
        // create new
        const insertSqlQuery = "INSERT INTO `rubric_component_submission_mark` (`rubric_component_submission_mark_id`, `student_exam_submission_id`, `rubric_component_id`, `rubric_component_mark`) VALUES (NULL, ?, ?, ?);"
        const insertBindingParams = [student_exam_submission_id, rubric_component_id, rubric_component_mark]
        const [responseFromUpdateQuery] = await db.query(insertSqlQuery, insertBindingParams)
        return true
    } else {
        // update current
        console.log('hello from udapte current')
        const { rubric_component_submission_mark_id } = responseFromFindCurrent[0]
        const bindingParams = [rubric_component_mark, rubric_component_submission_mark_id]
        const updateSqlQuery = "UPDATE `rubric_component_submission_mark` SET `rubric_component_mark` = ? WHERE `rubric_component_submission_mark`.`rubric_component_submission_mark_id` = ?"
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

module.exports = {
    handlePostCreateNewExamSubmissionEntry,
    handleGetExamSubmissionEntryByExamId,
    handleDeleteExamSubmissionEntryByStudentExamSubmissionId,
    handleGetStudentExamSubmissionByExamSubmissionId,
    handlePutUpdateRubricComponentMark,
    handlePutUpdateStudentExamSubmission
}