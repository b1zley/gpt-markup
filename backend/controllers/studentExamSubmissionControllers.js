const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

// request handlers
async function handlePostCreateNewExamSubmissionEntry(req, res) {
    try {
        const { module_id, exam_id } = req.params
        const student_id = req.body.student_id
        return res.status(200).json(await queryCreateNewExamSubmission(exam_id, student_id))
    } catch (err) {
        return res.status(500).send()
    }

}

async function handleGetExamSubmissionEntryByExamId(req, res) {
    try {
        const { module_id, exam_id } = req.params
        return res.status(200).json(await queryGetExamSubmissionByExamId(exam_id))
    } catch (err) {
        return res.status(500).send()
    }
}

async function handleDeleteExamSubmissionEntryByStudentExamSubmissionId(req,res) {
    try{
        const student_exam_submission_id = req.params.student_exam_submission_id
        await queryDeleteExamSubmissionByStudentExamSubmissionId(student_exam_submission_id)
        return res.status(204).send()
    }catch (err){
        console.log(err)
        return res.status(500).send()
    }
}

// query functions
async function queryCreateNewExamSubmission(exam_id, student_id) {
    const sqlQuery = "INSERT INTO `student_exam_submission` (`student_exam_submission_id`, `exam_id`, `student_id`, `exam_submission`, `marker_mark`, `marker_critique`, `file_system_id`, `ai_critique_id`) VALUES (NULL, ?, ?, NULL, NULL, NULL, NULL, NULL);"
    const bindingParams = [exam_id, student_id]
    const [responseFromInsert] = await db.query(sqlQuery, bindingParams)
    const student_exam_submission_id = responseFromInsert.insertId
    return { student_exam_submission_id }
}

async function queryGetExamSubmissionByExamId(exam_id) {
    const sqlQuery = 'SELECT * FROM student_exam_submission INNER JOIN student ON student_exam_submission.student_id = student.student_id WHERE student_exam_submission.exam_id = ?'
    const bindingParams = [exam_id]
    const [queryResponse] = await db.query(sqlQuery, bindingParams)
    return queryResponse
}

async function queryDeleteExamSubmissionByStudentExamSubmissionId(student_exam_submission_id){
    console.log(student_exam_submission_id)
    const sqlQuery = 'DELETE FROM student_exam_submission WHERE `student_exam_submission`.`student_exam_submission_id` = ?'
    const bindingParams = [student_exam_submission_id]
    const [responseFromDeleteQuery] = await db.query(sqlQuery, bindingParams)
    return true
}

module.exports = {
    handlePostCreateNewExamSubmissionEntry,
    handleGetExamSubmissionEntryByExamId,
    handleDeleteExamSubmissionEntryByStudentExamSubmissionId
}