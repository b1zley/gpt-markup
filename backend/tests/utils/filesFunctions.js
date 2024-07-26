function getFilesUrlFromPath(path){
    return `/files/${path}?`
}

async function getRequestPath(agent, delimPath){
    return agent.get(getFilesUrlFromPath(delimPath))
}

module.exports = {
    getRequestPath
}

