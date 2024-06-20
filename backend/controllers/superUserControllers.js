const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

async function getAllSuperUsers(req, res) {
    try {
        const sqlQueryGetAllSuperusers = 'SELECT super_user_id, super_user_name, super_user_type_name, access_rights FROM super_user INNER JOIN super_user_type ON super_user.super_user_type_id = super_user_type.super_user_type_id '
        const [queryResponse] = await db.query(sqlQueryGetAllSuperusers)
        return res.status(200).json(queryResponse)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryMarkerSuperUsersByExamId(examId) {
    const sqlQuery = 'SELECT exam_super_user.exam_id,super_user.super_user_id, super_user_name, super_user_type_name, super_user_type.super_user_type_id, access_rights FROM super_user INNER JOIN super_user_type ON super_user.super_user_type_id = super_user_type.super_user_type_id INNER JOIN exam_super_user ON exam_super_user.super_user_id = super_user.super_user_id WHERE exam_super_user.exam_id = ?'
    const bindingParams = [examId]
    const [querySuperUserExamId] = await db.query(sqlQuery, bindingParams)
    return querySuperUserExamId
}

async function queryLecturerSuperUsersByModuleId(moduleId) {
    const sqlQuery = 'SELECT super_user.super_user_id, super_user_name, super_user_type_name, super_user_type.super_user_type_id, access_rights FROM super_user INNER JOIN super_user_type ON super_user.super_user_type_id = super_user_type.super_user_type_id INNER JOIN module_super_user ON module_super_user.super_user_id = super_user.super_user_id WHERE module_super_user.module_id = ?'
    const bindingParams = [moduleId]
    const [querySuperUserExamId] = await db.query(sqlQuery, bindingParams)
    return querySuperUserExamId
}

async function querySuperUsersByAccessId(accessId) {
    const sqlQuery = 'SELECT super_user.super_user_id, super_user_name, super_user_type_name, super_user_type.super_user_type_id, access_rights FROM super_user INNER JOIN super_user_type ON super_user.super_user_type_id = super_user_type.super_user_type_id WHERE super_user.super_user_type_id = ?'
    const bindingParams = [accessId]
    const [queryResponseQueryByAccessId] = await db.query(sqlQuery, bindingParams)
    return queryResponseQueryByAccessId
}

async function getExamAccessSuperUsersByQueryParams(req, res) {
    try {
        const examIdToQuery = req.query.exam_id
        const moduleIdToQuery = req.query.module_id

        let superUsersToReturn = []
        // get super user markers with access to the exam
        superUsersToReturn = [...superUsersToReturn, ...await queryMarkerSuperUsersByExamId(examIdToQuery)]
        // get super user lecturers with access to the module
        superUsersToReturn = [...superUsersToReturn, ...await queryLecturerSuperUsersByModuleId(moduleIdToQuery)]
        // get super users with administrator access
        const administratorAccessId = 1
        superUsersToReturn = [...superUsersToReturn, ...await querySuperUsersByAccessId(administratorAccessId)]

        return res.status(200).json(superUsersToReturn)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}


async function requestHandlerGetSuperUserBySuperUserType(req, res) {
    try {
        const super_user_type_id = req.params.super_user_type_id
        const [superUserData] = await querySuperUserBySuperUserType(super_user_type_id)
        return res.status(200).json(superUserData)
    } catch (err) {
        return res.status(500).send()
    }
}

async function querySuperUserBySuperUserType(super_user_type_id) {
    const sqlQuery = 'SELECT super_user_id, super_user_name, super_user.super_user_type_id, super_user_type_name, access_rights FROM super_user INNER JOIN super_user_type ON super_user.super_user_type_id = super_user_type.super_user_type_id WHERE super_user.super_user_type_id = ?'
    const bindingParameters = [super_user_type_id]
    const responseFromSqlQuery = await db.query(sqlQuery, bindingParameters)
    return responseFromSqlQuery
}


async function requestHandlerGetLecturerModuleAccess(req, res) {
    try {
        const { module_id } = req.params
        return res.status(200).json(await queryLecturerModuleAccess(module_id))
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryLecturerModuleAccess(module_id) {
    const sqlQuery = "SELECT su.super_user_id, su.super_user_name, su.super_user_email, sut.super_user_type_name, sut.super_user_type_id FROM super_user su INNER JOIN module_super_user msu ON msu.super_user_id = su.super_user_id INNER JOIN super_user_type sut ON sut.super_user_type_id = su.super_user_type_id  WHERE msu.module_id = ? AND su.super_user_type_id = 3"
    const bindingParams = [module_id]
    const [lecturerRows] = await db.query(sqlQuery, bindingParams)
    return lecturerRows
}


async function requestHandlerDeleteLecturerModuleAccess(req, res) {
    try {
        const { module_id, super_user_id } = req.params
        await queryDeleteModuleAccessLecturer(module_id, super_user_id)
        return res.status(204).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryDeleteModuleAccessLecturer(module_id, super_user_id) {

    const sqlQuery = "DELETE FROM module_super_user WHERE module_id = ? AND super_user_id = ?"
    const bindingParams = [module_id, super_user_id]

    const [responseFromDeleteQuery] = await db.query(sqlQuery, bindingParams)
}


async function handlePostLecturerToModule(req, res) {
    try {
        const { module_id } = req.params
        const { super_user_id } = req.body
        return res.status(201).json({module_super_user_id: await queryInsertLecturerModuleAccess(super_user_id, module_id)})
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function queryInsertLecturerModuleAccess(super_user_id, module_id) {
    const sqlQuery = "INSERT INTO `module_super_user` (`module_super_user_id`, `module_id`, `super_user_id`) VALUES (NULL, ?, ?);"
    const bindingParams = [module_id, super_user_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    return responseFromInsert.insertId
}

module.exports = {
    getAllSuperUsers,
    getExamAccessSuperUsersByQueryParams,
    requestHandlerGetSuperUserBySuperUserType,
    requestHandlerGetLecturerModuleAccess,
    requestHandlerDeleteLecturerModuleAccess,
    handlePostLecturerToModule
}