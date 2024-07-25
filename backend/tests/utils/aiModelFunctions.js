


function getBaseAIUrl(){
    return `/ai_model`
}

async function getModels(agent){
    return agent.get(`${getBaseAIUrl()}`)
}


module.exports = {
    getModels
}