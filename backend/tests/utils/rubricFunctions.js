


async function addNewRcToExam(agent, module_id, exam_id, rubric_component_name) {
    const postUrl = `/module/${module_id}/exam/${exam_id}/rubric`
    const postBody = {
        rubric_component_name
    }
    return await agent.post(postUrl).send(postBody)
}


async function updateRc(agent, module_id, exam_id, rubric_component_id, updateBody) {
    const putUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}`
    return await agent.put(putUrl).send(updateBody)
}

async function getRC(agent, module_id, exam_id, rubric_component_id) {
    const getUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}`
    return await agent.get(getUrl)
}

async function deleteRC(agent, module_id, exam_id, rubric_component_id) {
    const deleteUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}`
    return await agent.delete(deleteUrl)
}

async function addRRToRc(agent, module_id, exam_id, rubric_component_id) {
    const postUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}/rating_range`
    return await agent.post(postUrl)
}

async function updateRRInRc(agent, module_id, exam_id, rubric_component_id, rating_range_id, putBody) {
    const putUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}/rating_range/${rating_range_id}`
    return await agent.put(putUrl).send(putBody)
}

async function deleteRRInRc(agent, module_id, exam_id, rubric_component_id, rating_range_id) {
    const deleteUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}/rating_range/${rating_range_id}`
    return await agent.delete(deleteUrl)
}


async function createNewRRInRcComplete(agent, module_id, exam_id, rubric_component_id, postBody) {
    const postUrl = `/module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}/rating_range/complete`
    return await agent.post(postUrl).send(postBody)
}

async function addRubricByCSVUpload(agent, module_id, exam_id, csv_path) {
    const postUrl = `/module/${module_id}/exam/${exam_id}/rubric/csv_upload`
    return await agent
        .post(postUrl)
        .attach('file', csv_path)
        .catch(err => {
            console.error('Request failed:', err);
            throw err;
        });
}


module.exports = {
    addNewRcToExam,
    updateRc,
    getRC,
    deleteRC,
    addRRToRc,
    updateRRInRc,
    deleteRRInRc,
    createNewRRInRcComplete,
    addRubricByCSVUpload
}