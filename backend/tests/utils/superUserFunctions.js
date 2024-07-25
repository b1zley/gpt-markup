


const superUserBaseUrl = '/super_user'

async function getAllSuperUsers(agent) {
    return await agent.get(superUserBaseUrl)
}

async function addLecturerToModule(agent, module_id, super_user_id) {
    const postBody = {
        super_user_id
    }
    const postUrl = `${superUserBaseUrl}/module/${module_id}/lecturer`
    return await agent.post(postUrl).send(postBody)
}

async function examSearch(agent, module_id, exam_id){
    const getUrl = `${superUserBaseUrl}/exam_search?exam_id=${exam_id}&module_id=${module_id}`
    return await agent.get(getUrl)
}

async function getSuperUsersByTypeId(agent, super_user_type_id){
    const getUrl = `${superUserBaseUrl}/super_user_type_id/${super_user_type_id}`
    return await agent.get(getUrl)
}

async function getSuperUsersInModule(agent, module_id){
    const getUrl = `${superUserBaseUrl}/module/${module_id}`
    return await agent.get(getUrl)
}

async function deleteSuperUserFromModule(agent, module_id, super_user_id){
    const deleteUrl = `${superUserBaseUrl}/module/${module_id}/lecturer/${super_user_id}`
    return await agent.delete(deleteUrl)
}


module.exports = {
    getAllSuperUsers,
    addLecturerToModule,
    examSearch,
    getSuperUsersByTypeId,
    getSuperUsersInModule,
    deleteSuperUserFromModule,
}