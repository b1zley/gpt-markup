const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions')



describe('Student Exam Submission Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    describe('/module/:module_id/exam/:exam_id/student_exam_submission', () => {
        let createdModuleId
        let createdExamId

        let createdModuleName = 'test module exam test'
        let createdExamName = 'test exam exam test'
        // create module first
        beforeAll(async () => {
            createdModuleId = await createModule(agent, createdModuleName)
            const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
            createdExamId = createExamResponse.body.exam_id
        })
        // tear down created module and exam
        afterAll(async () => {
            await deleteModule(agent, createdModuleId)
        })


        describe('POST /', () => {
            it('should be true' , () => {
                expect(true).toBe(true)
            })

        })

        describe('GET /', () => {



        })

        describe('DELETE /:student_exam_submission_id', () => {



        })

        describe('GET /:student_exam_submission_id', () => {



        })

        describe('PUT /:student_exam_submission_id/rubric_component/:rubric_component_id', () => {



        })

        describe('PUT /:student_exam_submission_id', () => {


        })

        describe('POST /:student_exam_submission_id/ai', () => {


        })

        describe('PUT /:student_exam_submission_id/marked_for_training', () => {


        })

        describe('DELETE /:student_exam_submission_id/marked_for_training', () => {



        })




    })

})