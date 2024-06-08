const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

async function getAllModuleIds(req, res) {
    try {
        const sqlQuery = 'SELECT module_id FROM module'
        const [responseFromAllModules] = await db.query(sqlQuery)
        const moduleIds = responseFromAllModules.map((moduleRow) => moduleRow.module_id)
        return res.status(200).json(moduleIds)
    } catch (err) {
        return res.status(500).send()
    }
}

async function getModuleDataByModuleId(req, res) {
    try {
        const sqlQuery = 'SELECT * FROM module WHERE module_id = ?'
        const bindingParams = [req.params.module_id]
        const [responseFromModuleIdSearch] = await db.query(sqlQuery, bindingParams)
        return res.status(200).json(responseFromModuleIdSearch)
    } catch (err) {
        return res.status(500).send()
    }
}

async function getExamsByModule(req, res) {
    try {
        const sqlQuery = 'SELECT * FROM module INNER JOIN exam ON module.module_id = exam.module_id WHERE exam.module_id = ?'
        const bindingParams = [req.params.module_id]
        const [responseFromModuleIdSearch] = await db.query(sqlQuery, bindingParams)
        return res.status(200).json(responseFromModuleIdSearch)
    } catch (err) {
        return res.status(500).send()
    }
}

module.exports = {
    getAllModuleIds,
    getModuleDataByModuleId,
    getExamsByModule
}