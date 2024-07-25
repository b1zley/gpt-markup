const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions');
const { getModels } = require('../../utils/aiModelFunctions');
const { getAllSuperUsers, addLecturerToModule, examSearch, getSuperUsersByTypeId, getSuperUsersInModule, deleteSuperUserFromModule } = require('../../utils/superUserFunctions');

const { searchStudentsStudentNumber } = require('../../utils/studentFunctions')

describe('Student Suite', () => {

    let agent;
    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    const validQueryParam = '4010009'

    describe('/student', () => {
        describe('given valid student number query parameter', () => {
            it('should return status 200 with array of matching students', async () => {
                const searchStudentsStudentNumberRes = await searchStudentsStudentNumber(agent, validQueryParam)
                expect(searchStudentsStudentNumberRes.statusCode).toBe(200)
                const students = searchStudentsStudentNumberRes.body
                students.forEach((student) => {
                    expect(student.student_number.includes(validQueryParam)).toBe(true)
                })
            })
        })
    })
})