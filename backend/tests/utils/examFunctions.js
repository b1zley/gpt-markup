

/**
 * 
 * @param {*} agent 
 * @param {*} exam_name 
 * @param {*} module_id 
 * @returns response entirity
 */
async function createNewExam(agent, exam_name, module_id){
    const postUrl = `/module/${module_id}/exam`
    const postBody = {
        exam_name
    }
    return await agent.post(postUrl).send(postBody)
}


async function getExam(agent, module_id, exam_id ){
    const getUrl = `/module/${module_id}/exam/${exam_id}`
    return await agent.get(getUrl)
}

async function deleteExam(agent, module_id, exam_id){
    const deleteUrl = `/module/${module_id}/exam/${exam_id}`
    return await agent.delete(deleteUrl)
}

async function updateExam(agent, module_id, exam_id, updateBody){
    const putUrl = `/module/${module_id}/exam/${exam_id}`
    return await agent.put(putUrl).send(updateBody)
}


async function getModulesExams(agent, module_id){
    const getUrl = `/module/${module_id}/exam`
    return await agent.get(getUrl)
}


async function addSuperUserToExam(agent, module_id, exam_id, super_user_id){
    const postUrl = `/module/${module_id}/exam/${exam_id}/super_user`
    const postBody = {
        super_user_id
    }
    return await agent.post(postUrl).send(postBody)
}

async function removeSuperUserFromExam(agent, module_id, exam_id, super_user_id){
    const deleteUrl = `/module/${module_id}/exam/${exam_id}/super_user/${super_user_id}`
    return await agent.delete(deleteUrl)
}

async function addFileTypeToExam(agent, module_id, exam_id, file_type_id){
    const postUrl = `/module/${module_id}/exam/${exam_id}/file_type`
    const postBody = {
        file_type_id
    }
    return await agent.post(postUrl).send(postBody)
}

async function removeFileTypeFromExam(agent, module_id, exam_id, file_type_id){
    const deleteUrl = `/module/${module_id}/exam/${exam_id}/file_type/${file_type_id}`
    return await agent.delete(deleteUrl)
}


module.exports = {
    createNewExam,
    getExam,
    deleteExam,
    updateExam,
    getModulesExams,
    addSuperUserToExam,
    removeSuperUserFromExam,
    addFileTypeToExam,
    removeFileTypeFromExam
}