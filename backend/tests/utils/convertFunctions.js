const baseConvertUrl = `/convert`


async function convertRtfToPlainText(agent, filePath){
    const postUrl = `${baseConvertUrl}/RtfToPlainText`
    return await agent
        .post(postUrl)
        .attach('file', filePath)
        .catch(err => {
            console.error('Failed: ', err)
            throw err;
        })
}

module.exports = {
    convertRtfToPlainText
}