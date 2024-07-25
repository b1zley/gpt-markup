const baseStudentUrl = `/student`


async function searchStudentsStudentNumber(agent, student_number_key){
    const getUrl = `${baseStudentUrl}/search?student_number_key=${student_number_key}`
    return await agent.get(getUrl)
}


module.exports = {
    searchStudentsStudentNumber
}