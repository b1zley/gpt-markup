
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

async function handlePutUpdateRubricComponentById(req, res) {
    try {
        // parse request and pass values as argument to query function
        let updateArray = []
        for (const paramToUpdate in req.body) {
            const updateElement = {
                paramToUpdate,
                valueToUpdate: req.body[paramToUpdate]
            }
            updateArray.push(updateElement)
        }
        const { rubric_component_id } = req.params
        await queryUpdateRubricComponent(rubric_component_id, updateArray)
        return res.status(200).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function handlePutRequestRatingRange(req, res) {
    try {
        // rating_range_id, updateArray
        const { rating_range_id } = req.params

        let updateArray = []

        for (const paramToUpdate in req.body) {
            const updateElement = {
                paramToUpdate,
                valueToUpdate: req.body[paramToUpdate]
            }
            updateArray.push(updateElement)
        }

        await queryUpdateRatingRange(rating_range_id, updateArray)

        return res.status(200).send()
    } catch (err) {
        return res.status(500).send()
    }

}

async function handlePostRatingRangeInRubricComponent(req, res) {
    try {
        const { rubric_component_id } = req.params
        return res.status(201).json({ rating_range_id: await queryInsertNewRatingRangeByRubricComponentId(rubric_component_id) })
    } catch (err) {
        return res.status(500).send()
    }
}

async function handleDeleteRatingRange(req,res){
    try{
        const {rating_range_id} = req.params
        await queryDeleteRatingRange(rating_range_id)
        return res.status(204).send()

    } catch(err){
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
    const sqlQuery = 'SELECT * FROM rubric_component INNER JOIN exam ON rubric_component.exam_id = exam.exam_id INNER JOIN module ON exam.module_id = module.module_id WHERE rubric_component_id = ?'
    const bindingParams = [rubric_component_id]
    let [dbResult] = await db.query(sqlQuery, bindingParams)
    let rubricComponent = dbResult[0]
    rubricComponent.rating_ranges = [];
    let ratingRangesToAdd = await queryGetRatingRangesByRubricComponentId(rubric_component_id);
    rubricComponent.rating_ranges = ratingRangesToAdd;
    return rubricComponent
}


async function queryGetRatingRangesByRubricComponentId(rubric_component_id) {
    const sqlQuery = 'SELECT * FROM rating_range WHERE rubric_component_id = ?'
    const bindingParams = [rubric_component_id]

    const [ratingRanges] = await db.query(sqlQuery, bindingParams)
    return ratingRanges
}


async function queryUpdateRubricComponent(rubric_component_id, updateArray) {
    // structure of update array 
    // [{paramToUpdate, valueToUpdate}]

    // allowed column names
    const allowedColumnNames = await getColumnNamesRubricComponent()

    let bindingParams = []
    let sqlQuery = 'UPDATE `rubric_component` SET '

    // programmatically add params and values to binding params, and extend query string
    updateArray.forEach((updateObject, i) => {

        // validate column names in request are present in table schema
        if (!allowedColumnNames.includes(updateObject.paramToUpdate)) {
            throw new Error('Disallowed column name')
        }
        sqlQuery += `${updateObject.paramToUpdate} = ?`
        if (i < updateArray.length - 1) {
            sqlQuery += ','
        }
        sqlQuery += ' '
        bindingParams.push(updateObject.valueToUpdate)
    })

    sqlQuery += ' WHERE `rubric_component_id` = ?'
    bindingParams.push(rubric_component_id)

    const [responseFromUpdate] = await db.query(sqlQuery, bindingParams)
    return true
}


async function getColumnNamesRubricComponent() {
    const sqlQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'gpt_markup' AND TABLE_NAME = 'rubric_component'"
    const [responseFromQuery] = await db.query(sqlQuery)
    const columnNames = responseFromQuery.map((row) => row.COLUMN_NAME)
    return columnNames
}

async function getColumnNamesRatingRange() {
    const sqlQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'gpt_markup' AND TABLE_NAME = 'rating_range'"
    const [responseFromQuery] = await db.query(sqlQuery)
    const columnNames = responseFromQuery.map((row) => row.COLUMN_NAME)
    return columnNames
}

/**
 * create new rating range
 * @param {*} rubric_component_id 
 */
async function queryInsertNewRatingRangeByRubricComponentId(rubric_component_id) {
    const sqlQuery = "INSERT INTO `rating_range` (`rating_range_id`, `rating_min_incl`, `rating_max_incl`, `rating_desc`, `rubric_component_id`) VALUES (NULL, NULL, NULL, NULL, ?);"
    const bindingParams = [rubric_component_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    return responseFromInsert.insertId
}

/**
 * update rating range
 * @param {*} rating_range_id 
 * @param {*} updateArray 
 */
async function queryUpdateRatingRange(rating_range_id, updateArray) {
    let bindingParams = []
    let sqlQuery = "UPDATE rating_range SET "
    const allowableNames = await getColumnNamesRatingRange()
    updateArray.forEach((updateObject, i) => {
        if (!allowableNames.includes(updateObject.paramToUpdate)) {
            throw new Error('Parameter not recognised')
        }
        sqlQuery += `${updateObject.paramToUpdate} = ?`
        if (i < updateArray.length - 1) {
            sqlQuery += ','
        }
        sqlQuery += ' '
        bindingParams.push(updateObject.valueToUpdate)
    })
    sqlQuery += ' WHERE rating_range_id = ?'
    bindingParams.push(rating_range_id)
    const [responseFromUpdateQuery] = await db.query(sqlQuery, bindingParams)
    return true
}

async function queryDeleteRatingRange(rating_range_id){
    console.log(rating_range_id)

    const sqlQuery = "DELETE FROM `rating_range` WHERE `rating_range`.`rating_range_id` = ?"
    const bindingParams = [rating_range_id]
    
    const [responseFromDelete] = await db.query(sqlQuery, bindingParams)
    return true

}

module.exports = {

    handleRemoveRubricFromExam,
    handlePostNewRubricToExam,
    handleGetRubricComponentById,
    handlePutUpdateRubricComponentById,
    handlePostRatingRangeInRubricComponent,
    handlePutRequestRatingRange,
    handleDeleteRatingRange

}
