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



async function createNewModule(req,res){
    try{
        const module_name = req.body.module_name
        const sqlQuery = "INSERT INTO `module` (`module_id`, `module_name`) VALUES (NULL, ?);"
        const [responseFromInsertModule] = await db.query(sqlQuery, [module_name])
        return res.status(201).json({module_id : responseFromInsertModule.insertId})
    } catch (err){
        return res.status(500).send()
    }
}

module.exports = {
    getAllModuleIds,
    getModuleDataByModuleId,
    createNewModule
}