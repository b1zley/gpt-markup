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



async function createNewModule(req, res) {
    try {
        // console.log('hello from create new module')
        const module_name = req.body.module_name
        const sqlQuery = "INSERT INTO `module` (`module_id`, `module_name`) VALUES (NULL, ?);"
        const [responseFromInsertModule] = await db.query(sqlQuery, [module_name])
        return res.status(201).json({ module_id: responseFromInsertModule.insertId })
    } catch (err) {
        // console.log(err)
        return res.status(500).send()
    }
}


/**
 * 
 * check if lecturer has access to module
 * @param {} req 
 * @param {*} res 
 * @returns 
 */
async function getModulesBySuperUserId(req, res) {
    try {
        const module_id = req.params.module_id
        const super_user_id = req.params.super_user_id
        let sqlSearchAndJoin = "SELECT * FROM module INNER JOIN module_super_user ON module.module_id = module_super_user.module_id WHERE super_user_id = ? "
        let bindingParams = [super_user_id]
        if (module_id != '*') {
            sqlSearchAndJoin += 'AND module.module_id = ?'
            bindingParams = [super_user_id, module_id]
        }

        console.log(sqlSearchAndJoin)
        const [responseFromSearchByModuleIdAndSuperUserId] = await db.query(sqlSearchAndJoin, bindingParams)
        console.log(responseFromSearchByModuleIdAndSuperUserId)
        return res.status(200).json(responseFromSearchByModuleIdAndSuperUserId)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}


async function handleGetModulesWithExams(req, res) {

    try {
        let modulesToReturn = await queryGetModules()
        return res.status(200).json(modulesToReturn)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

const examControllers = require('./examControllers')

async function queryGetModules() {
    const moduleSqlQuery = "SELECT * FROM module"
    const [moduleRows] = await db.query(moduleSqlQuery)

    for (const moduleRow of moduleRows) {
        // get exams within module
        const module_id = moduleRow.module_id
        moduleRow.exams = await examControllers.handleQueryExamsByModuleId(module_id)
    }
    return moduleRows
}


async function handleDeleteModuleById(req, res) {
    const { module_id } = req.params
    try{
        await queryDeleteModuleById(module_id)
        return res.status(204).send()
    } catch (err){
        console.log(err)
        return res.status(500).send()
    }
}

async function queryDeleteModuleById(module_id){
    const sqlQuery = "DELETE FROM module WHERE `module`.`module_id` = ?"
    const bindingParams = [module_id]
    const [responseFromDelete] = await db.query(sqlQuery, bindingParams)
    return true
}

module.exports = {
    getAllModuleIds,
    getModuleDataByModuleId,
    createNewModule,
    getModulesBySuperUserId,
    handleGetModulesWithExams,
    handleDeleteModuleById
}