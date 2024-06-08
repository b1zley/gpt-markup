const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies


/**
 * should create a naked exam - exam id, exam name, everything else later...
 * @param {*} req 
 * @param {*} res 
 */
async function createNewExam(req, res) {
    console.log(req.params)
    const module_id = req.params.module_id
    const exam_name = req.body.exam_name

    if (!module_id || !exam_name) {
        return res.status(400).send()
    }

    const createExamSqlQuery = "INSERT INTO `exam` (`exam_id`, `module_id`, `exam_name`, `rubric`, `exam_question`, `model_answer`, `file_system_id`, `prompt_specifications`, `chosen_ai_model_id`) VALUES (NULL, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL);"
    const bindingParamsCreateExamQuery = [module_id, exam_name]
    try {
        const [responseFromInsert] = await db.query(createExamSqlQuery, bindingParamsCreateExamQuery)
        const insertId = responseFromInsert.insertId
        return res.status(201).json({ exam_id: insertId })
    } catch (err) {
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
        return res.status(200).send()
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
        const sqlQuery = 'SELECT * FROM exam WHERE exam_id = ?'
        const exam_id = req.params.exam_id
        const [responseFromSqlQuery] = await db.query(sqlQuery, [exam_id])
        return res.status(200).json(responseFromSqlQuery[0])
    } catch (err) {
        return res.status(500).send()
    }
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



module.exports = {
    createNewExam,
    updateExam,
    getExamById,
    getAllExamIds,
    getExamsByModule
}