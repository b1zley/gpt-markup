const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies


async function getAllHandler(req, res) {
    try {
        return res.status(200).json(await findAllModels()) 
    } catch (err) {
        return res.status(500).send()
    }
}


async function findAllModels() {
    const sqlQuery = 'SELECT * FROM trained_model'
    const [responseFromModelQuery] = await db.query(sqlQuery)
    return responseFromModelQuery
}

module.exports = {

    getAllHandler

}




