async function createModule(agent, module_name) {
    const modulePostUrl = '/module'
    const modulePostBody = { module_name }
    const moduleCreateResponse = await agent.post(modulePostUrl)
        .send(modulePostBody)
    const createdModuleId = moduleCreateResponse.body.module_id
    return createdModuleId
}

async function addSuperUserToModule(agent, module_id, super_user_id) {
    const postBody = {
        super_user_id
    }
    const postUrl = `/super_user/module/${module_id}/lecturer`
    const response = await agent.post(postUrl).send(postBody)
    return true
}



async function deleteModule(agent, module_id) {
    await agent.delete(`/module/${module_id}`)
}


module.exports = {
    createModule,
    addSuperUserToModule,
    deleteModule
}