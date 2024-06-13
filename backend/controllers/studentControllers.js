const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

// request handlers

/**
 * just student numbers for now, maybe implement for names also later
 * @param {*} req 
 * @param {*} res 
 */
async function handleGetRequestSearchStudent(req, res) {
    try {
        const student_number_key = req.query.student_number_key
        return res.status(200).json(await querySearchStudent(student_number_key))
    } catch (err) {
        return res.status(500).send()
    }

}




// queries

/**
 * student numbers only rn, maybe change implementation to include names later
 */
async function querySearchStudent(student_number_key) {
    let studentNumberToSearchKey = '%' + student_number_key + '%'
    const sqlQuery = 'SELECT * FROM student WHERE student_number LIKE ?'
    const bindingParams = [studentNumberToSearchKey]
    const [responseFromSearchQuery] = await db.query(sqlQuery, bindingParams)
    return responseFromSearchQuery
}

module.exports = {
    handleGetRequestSearchStudent

}