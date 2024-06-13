
const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

// request handlers
async function handlePostNewRubricToExam(req, res) {
    try {
        const { exam_id, module_id } = req.params
        const { rubric_component_name } = req.body
        return res.status(201).json(await queryCreateNewRubric(exam_id, rubric_component_name))
    } catch (err) {
        return res.status(500).send()
    }

}

async function handleRemoveRubricFromExam(req, res) {
    try {
        const { rubric_component_id } = req.params
        await queryDeleteRubric(rubric_component_id)
        return res.status(204).send()
    } catch (err) {
        return res.status(500).send()
    }

}

async function handleGetRubricComponentById(req, res) {
    try {
        const { rubric_component_id } = req.params
        return res.status(200).json(await queryGetRubricComponentInformationById(rubric_component_id))
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }

}

// query functions

async function queryCreateNewRubric(exam_id, rubric_component_name) {
    const sqlQuery = "INSERT INTO `rubric_component` (`rubric_component_id`, `name`, `rubric_component_desc`, `maximum`, `exam_id`, `component_order`) VALUES (NULL, ?, NULL, NULL, ?, NULL);"
    const bindingParams = [rubric_component_name, exam_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    const rubric_component_id = responseFromInsert.insertId
    return { rubric_component_id }
}


async function queryDeleteRubric(rubric_component_id) {
    const sqlQuery = 'DELETE FROM rubric_component WHERE `rubric_component`.`rubric_component_id` = ?'
    const bindingParams = [rubric_component_id]
    const [responseFromDelete] = await db.query(sqlQuery, bindingParams)
    return true
}

async function queryGetRubricComponentInformationById(rubric_component_id) {
    console.log('hello from get')
    const sqlQuery = 'SELECT * FROM rubric_component INNER JOIN exam ON rubric_component.exam_id = exam.exam_id INNER JOIN module ON exam.module_id = module.module_id WHERE rubric_component_id = ?'
    const bindingParams = [rubric_component_id]
    let [dbResult] = await db.query(sqlQuery, bindingParams)

    let rubricComponent = dbResult[0]
    
    rubricComponent.rating_ranges = [];

    // Fetch rating ranges
    let ratingRangesToAdd = await queryGetRatingRangesByRubricComponentId(rubric_component_id);
    console.log('Rating ranges to add:', ratingRangesToAdd);

    // Properly assign rating ranges
    rubricComponent.rating_ranges = ratingRangesToAdd;
    console.log('Final rubric component with rating ranges:', rubricComponent);
    
    return rubricComponent

}


async function queryGetRatingRangesByRubricComponentId(rubric_component_id) {
    const sqlQuery = 'SELECT * FROM rating_range WHERE rubric_component_id = ?'
    const bindingParams = [rubric_component_id]

    const [ratingRanges] = await db.query(sqlQuery, bindingParams)
    return ratingRanges
}

module.exports = {

    handleRemoveRubricFromExam,
    handlePostNewRubricToExam,
    handleGetRubricComponentById

}
