const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies


/**
 * should create a naked exam - exam id, exam name, everything else later...
 * @param {*} req 
 * @param {*} res 
 */
async function createNewExam(req, res) {

    const initialTopP = 0
    const initialTemp = 0

    // console.log(req.params)
    // console.log(req.body)
    const module_id = req.params.module_id
    const exam_name = req.body.exam_name

    if (!module_id || !exam_name) {
        return res.status(400).send()
    }

    const createExamSqlQuery = "INSERT INTO `exam` (`exam_id`, `module_id`, `exam_name`, `exam_question`,  `file_system_id`, `prompt_specifications`, `chosen_ai_model_id`, `temperature`, `top_p`) VALUES (NULL, ?, ?, NULL,  NULL, NULL, 3, 0,0);"
    const bindingParamsCreateExamQuery = [module_id, exam_name]
    try {
        const [responseFromInsert] = await db.query(createExamSqlQuery, bindingParamsCreateExamQuery)
        const insertId = responseFromInsert.insertId
        return res.status(201).json({ exam_id: insertId })
    } catch (err) {
        console.log(err)
        return res.status(500)
    }
}

/**
 * update a specific exam by exam_id - can update any number of the exam parameters as defined by exam table
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateExam(req, res) {
    const exam_id = req.params.exam_id
    let updateQueryComponents = []
    let updateBindingParams = []

    for (const bodyParam in req.body) {
        updateQueryComponents.push(`${bodyParam} = ?`)
        updateBindingParams.push(req.body[bodyParam])
    }

    let sqlUpdateQuery = "UPDATE `exam` SET "

    for (let i = 0; i < updateQueryComponents.length; i++) {
        sqlUpdateQuery += updateQueryComponents[i]
        if (i < updateQueryComponents.length - 1) {
            sqlUpdateQuery += ', '
        } else {
            sqlUpdateQuery += ' '
        }
    }

    let whereFragmentSqlQuery = "WHERE `exam`.`exam_id` = ?"
    updateBindingParams.push(exam_id)
    sqlUpdateQuery += whereFragmentSqlQuery
    const [responseFromUpdate] = await db.query(sqlUpdateQuery, updateBindingParams)

    if (responseFromUpdate.affectedRows === 1) {
        return await getExamById(req, res)
    } else {
        return res.status(500).send()
    }
}

/**
 * returns exam parameters for an exam matching an id passed as req.params.exam_id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getExamById(req, res) {
    try {
        const exam_id = req.params.exam_id
        return res.status(200).json(await queryGetExamById(exam_id))
    } catch (err) {
        // console.log('error: ',err)
        if(err.message === 'NOT FOUND'){
            return res.status(404).send()
        }

        return res.status(500).send()
    }
}

async function queryGetExamById(exam_id) {

    const sqlQuery = 'SELECT * FROM exam INNER JOIN module ON exam.module_id = module.module_id LEFT JOIN trained_model ON exam.chosen_ai_model_id = trained_model.trained_model_id WHERE exam_id = ?'
    
    const [responseFromSqlQuery] = await db.query(sqlQuery, [exam_id])

    let examObject = responseFromSqlQuery[0]
    if(!examObject){
        throw new Error('NOT FOUND')
    }

    examObject = {
        ...examObject,
        rubric: await queryGetRubricComponentsByExamId(exam_id),
        fileTypes: await queryGetFileTypesByExamId(exam_id)
    }

    return examObject
}


async function handlePostFileTypeToExam(req, res) {

    try {
        const { module_id, exam_id } = req.params
        const { file_type_id } = req.body
        const responseFromInsert = await queryInsertNewFileTypeExam(exam_id, file_type_id)
        return res.status(201).send()

    } catch (err) {
        return res.status(500).send()
    }


}

async function queryInsertNewFileTypeExam(exam_id, file_type_id) {
    const sqlQuery = "INSERT INTO `exam_file_type` (`exam_file_type_id`, `exam_id`, `file_type_id`) VALUES (NULL, ?, ?);"
    const bindingParams = [exam_id, file_type_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    if (responseFromInsert.affectedRows === 1) {
        return true
    } else {
        throw new Error()
    }
}

async function handleDeleteFileTypeFromExam(req, res) {
    // to do
    try {
        const { module_id, exam_id, file_type_id } = req.params
        const response = await queryDeleteFileTypeFromExam(exam_id, file_type_id)
        return res.status(204).send()

    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryDeleteFileTypeFromExam(exam_id, file_type_id) {
    const sqlQuery = "DELETE FROM exam_file_type WHERE `exam_file_type`.`file_type_id` = ? AND `exam_file_type`.`exam_id` = ?"
    const bindingParams = [file_type_id, exam_id]
    const [responseFromDeletion] = await db.query(sqlQuery, bindingParams)
    return true
}

async function queryGetFileTypesByExamId(exam_id) {
    try {
        const sqlQuery = "SELECT ft.file_type_id, ft.file_type_extension FROM file_types ft LEFT JOIN exam_file_type eft ON eft.file_type_id = ft.file_type_id WHERE exam_id = ? ORDER BY ft.file_type_id"
        const bindingParams = [exam_id]
        const [response] = await db.query(sqlQuery, bindingParams)

        const fileTypesSqlQuery = "SELECT ft.file_type_id, ft.file_type_extension FROM file_types ft"
        const [fileTypeRows] = await db.query(fileTypesSqlQuery)
        const finalFileTypes = fileTypeRows.map((row) => {
            let allowed = false
            response.forEach((responseRow) => {
                if (responseRow.file_type_id === row.file_type_id) {
                    allowed = true
                    return
                }
            })

            let newObject = {
                ...row,
                allowed
            }
            return newObject
        })


        return finalFileTypes

    } catch (err) {
        throw new Error()
    }
}


async function queryGetRubricComponentsByExamId(exam_id) {
    const sqlQuery = 'SELECT * FROM rubric_component WHERE exam_id = ?'
    const bindingParams = [exam_id]
    const [rubricComponents] = await db.query(sqlQuery, bindingParams)

    for (let i = 0; i < rubricComponents.length; i++) {
        const ratingRangesWithinRubric = await queryGetRatingRangesByRubricId(rubricComponents[i].rubric_component_id)
        let newRubricComponentObject = {
            ...rubricComponents[i],
            rating_ranges: ratingRangesWithinRubric
        }
        rubricComponents[i] = newRubricComponentObject
    }

    return rubricComponents
}


async function queryGetRatingRangesByRubricId(rubric_component_id) {
    const sqlQuery = 'SELECT * FROM rating_range WHERE rubric_component_id = ?'
    const bindingParams = [rubric_component_id]
    const [responseFromRatingRangeQuery] = await db.query(sqlQuery, bindingParams)
    return responseFromRatingRangeQuery
}



/**
 * returns all exam ids
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getAllExamIds(req, res) {
    try {
        const sqlQuery = 'SELECT exam_id FROM exam'
        const [responseFromSqlQuery] = await db.query(sqlQuery)
        const examIds = responseFromSqlQuery.map((row) => row.exam_id)
        return res.status(200).json(examIds)
    } catch (err) {
        return res.status(500).send()
    }
}

async function getExamsByModule(req, res) {

    try {
        const module_id = req.params.module_id
        return res.status(200).json(await handleQueryExamsByModuleId(module_id))
    } catch (err) {
        return res.status(500).send()
    }
}

async function handleQueryExamsByModuleId(moduleId) {
    const sqlQuery = 'SELECT * FROM module INNER JOIN exam ON module.module_id = exam.module_id WHERE exam.module_id = ?'
    const bindingParams = [moduleId]
    const [responseFromModuleIdSearch] = await db.query(sqlQuery, bindingParams)
    return responseFromModuleIdSearch
}


async function deleteExamController(req, res) {
    try {
        await deleteExam(req.params.exam_id)
        return res.status(204).send()
    } catch (err) {
        return res.status(500).send()
    }
}

async function deleteExam(exam_id) {
    const deleteSql = 'DELETE FROM exam WHERE `exam`.`exam_id` = ?'
    const bindingParams = [exam_id]
    const [responseFromDeleteExam] = await db.query(deleteSql, bindingParams)
    return true
}

async function requestHandlerDeleteSuperUserInExam(req, res) {
    try {
        // console.log('hello from del req handler')
        const super_user_id = req.params.super_user_id
        const module_id = req.params.module_id
        const exam_id = req.params.exam_id
        await queryDeleteExamSuperUser(super_user_id, exam_id)
        return res.status(204).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryDeleteExamSuperUser(super_user_id, exam_id) {
    const sqlQuery = 'DELETE FROM exam_super_user WHERE exam_id = ? AND super_user_id = ?'
    const bindingParams = [exam_id, super_user_id]
    const [responseFromDeleteQuery] = await db.query(sqlQuery, bindingParams)
    return true
}

async function requestHandlerPostSuperUserInExam(req, res) {
    try {
        const super_user_id = req.body.super_user_id
        const exam_id = req.params.exam_id
        await queryInsertExamSuperUser(super_user_id, exam_id)
        return res.status(201).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryInsertExamSuperUser(super_user_id, exam_id) {
    const sqlQuery = 'INSERT INTO exam_super_user (`exam_super_user_id`, `exam_id`, `super_user_id`) VALUES (NULL, ?, ?)'
    const bindingParams = [exam_id, super_user_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    return true
}

/**
 * return csv string
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function requestHandlerGetResultsAsCSV(req, res) {

    try {
        const { exam_id } = req.params
        const csvString = await queryGenerateResultsAsCSV(exam_id)
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment;filename=examResults-${exam_id}.csv`)
        return res.send(csvString)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }


}

/**
 * generate csv string
 * @param {*} exam_id 
 */
async function queryGenerateResultsAsCSV(exam_id) {
    // need to get the rubric components and columns for each
    const rubricComponentIds = await queryGetRubricComponentsByExamId(exam_id)
    let csvString = 'student_name, student_number'
    rubricComponentIds.forEach((rcid, i) => {
        csvString += `,rubric_component_mark_${i + 1}, rubric_component_critique_${i + 1}`
    })
    csvString += `\n`
    // console.log(csvString)
    // get each rubric component for each student exam submission
    const sesData = await queryGetStudentExamSubmissionsInfoForCSV(exam_id)
    // console.log('this is ses data')
    // console.log(sesData)
    sesData.forEach((sesRow, i) => {
        let csvRow = `${sesRow.student_name},${sesRow.student_number}`
        // console.log(Object.keys(sesRow))
        const objectKeys = Object.keys(sesRow)
        for (let i = 7; i < objectKeys.length; i++) {
            const keyName = objectKeys[i]
            const value = sesRow[objectKeys[i]]
            // console.log(`${keyName}: ${value}`)
            csvRow += `,"${value}"`
        }
        csvRow += `\n`
        csvString += csvRow
    })
    // console.log(csvString)
    // console.log(exam_id)
    return csvString
}


async function queryGetStudentExamSubmissionsInfoForCSV(exam_id) {
    // should also get the rubric component ids
    const rubricComponentIds = await queryGetRubricComponentsShallowByExamId(exam_id)
    // console.log('rcid', rubricComponentIds)

    let selectClause = `SELECT ses.student_exam_submission_id, ses.marked_for_training, 
    ses.exam_id, ses.student_id, 
    student.student_name, student.student_number`

    let groupByClause = `GROUP BY ses.student_exam_submission_id, ses.student_id, ses.exam_id`
    // programmatically add rc ids
    rubricComponentIds.forEach((rcid, i) => {
        selectClause += `, MAX(CASE WHEN rcsm.rubric_component_id = ${rcid} THEN rcsm.rubric_component_mark END) AS rubric_component_${rcid}_mark`
        selectClause += `, MAX(CASE WHEN rcsm.rubric_component_id = ${rcid} THEN rcsm.rubric_component_critique END) AS rubric_component_${rcid}_critique`
    })
    const rcsmSqlQuery = `${selectClause}
    FROM student_exam_submission ses 
    LEFT JOIN rubric_component_submission_mark rcsm ON ses.student_exam_submission_id = rcsm.student_exam_submission_id 
    INNER JOIN student ON student.student_id = ses.student_id WHERE exam_id = ?
    ${groupByClause}`

    const rcsmBindingParams = [exam_id]
    // console.log(rcsmSqlQuery)
    const [submissionsInfoResponse] = await db.query(rcsmSqlQuery, rcsmBindingParams)
    // console.log(submissionsInfoResponse)
    return submissionsInfoResponse
}


async function queryGetRubricComponentsShallowByExamId(exam_id) {
    const sqlQuery = 'SELECT * FROM rubric_component WHERE exam_id = ?'
    const bindingParams = [exam_id]

    const [response] = await db.query(sqlQuery, bindingParams)

    return response.map((row) => row.rubric_component_id)


}

async function requestHandlerLockOrUnlockExam(req, res) {


}

async function queryLockExam(exam_id) {

}

async function queryUnlockExam(exam_id) {

}



module.exports = {
    createNewExam,
    updateExam,
    getExamById,
    getAllExamIds,
    getExamsByModule,
    deleteExamController,
    requestHandlerDeleteSuperUserInExam,
    requestHandlerPostSuperUserInExam,
    handleQueryExamsByModuleId,
    handlePostFileTypeToExam,
    handleDeleteFileTypeFromExam,
    queryGetFileTypesByExamId,
    requestHandlerGetResultsAsCSV,
    queryGetRubricComponentsByExamId,
    queryGetExamById
}