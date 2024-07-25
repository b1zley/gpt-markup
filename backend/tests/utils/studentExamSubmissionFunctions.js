
function getBaseSESUrl(module_id, exam_id){
    return `/module/${module_id}/exam/${exam_id}/student_exam_submission`
}

async function addNewSES(agent, module_id, exam_id, student_id){
    const postBody = {
        student_id
    }
    const postUrl = getBaseSESUrl(module_id, exam_id)
    return await agent.post(postUrl).send(postBody)
}


async function getSESByEId(agent, module_id, exam_id){
    const getUrl = getBaseSESUrl(module_id, exam_id)
    return await agent.get(getUrl)
}

async function getSESBySESId(agent, module_id, exam_id, student_exam_submission_id){
    return await agent.get(`${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}`)
}

async function deleteSES(agent, module_id, exam_id, student_exam_submission_id){
    return await agent.delete(`${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}`)
}

async function updateRCMarkInSES(agent, module_id, exam_id, student_exam_submission_id,rubric_component_id, rubric_component_mark){
    const putUrl = `${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}/rubric_component/${rubric_component_id}`
    const putBody = {
        rubric_component_mark
    }
    return await agent.put(putUrl).send(putBody)
}

async function updateRCCritiqueInSES(agent, module_id, exam_id, student_exam_submission_id, rubric_component_id, rubric_component_critique){
    const putUrl = `${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}/rubric_component/${rubric_component_id}`
    const putBody = {
        rubric_component_critique
    }
    return await agent.put(putUrl).send(putBody)
}

async function updateSES(agent, module_id, exam_id, student_exam_submission_id, updateBody){
    const putUrl = `${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}`
    return await agent.put(putUrl).send(updateBody)
}

async function markForTraining(agent, module_id, exam_id, student_exam_submission_id){
    const putUrl = `${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}/marked_for_training`
    return await agent.put(putUrl)
}

async function unmarkForTraining(agent, module_id, exam_id, student_exam_submission_id){
    const deleteUrl = `${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}/marked_for_training`
    return await agent.delete(deleteUrl)
}

async function generateAiCritique(agent, module_id, exam_id, student_exam_submission_id){
    const postUrl = `${getBaseSESUrl(module_id, exam_id)}/${student_exam_submission_id}/ai`
    return await agent.post(postUrl)
}

module.exports = {
    addNewSES,
    getSESByEId,
    getSESBySESId,
    deleteSES,
    updateRCMarkInSES,
    updateRCCritiqueInSES,
    updateSES,
    markForTraining,
    unmarkForTraining,
    generateAiCritique
}