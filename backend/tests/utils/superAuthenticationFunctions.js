
const baseSuperAuthUrl = `/super_authentication`


async function createNewSuperUser(agent, email, name, password, accountCreationCode){
    const postUrl = `${baseSuperAuthUrl}/create`
    const postBody = {
        email, name, password, accountCreationCode
    }
    return await agent.post(postUrl).send(postBody)
}


async function deleteSuperUser(agent, super_user_id){
    const deleteUrl = `${baseSuperAuthUrl}/delete/${super_user_id}`
    return await agent.delete(deleteUrl)
}

async function loginSuperUser(agent, email, password){
    const postUrl = `${baseSuperAuthUrl}/login`
    const postBody = {
        email, password
    }
    return await agent.post(postUrl).send(postBody)
}


module.exports = {
    createNewSuperUser,
    deleteSuperUser,
    loginSuperUser
}
