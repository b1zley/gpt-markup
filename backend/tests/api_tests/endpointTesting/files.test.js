
const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')
const fs = require('fs').promises // used to delete and read files

const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions')

const { createNewSuperUser, deleteSuperUser, loginSuperUser } = require('../../utils/superAuthenticationFunctions');
const { getAllSuperUsers } = require('../../utils/superUserFunctions');
const { getRequestPath } = require('../../utils/filesFunctions');

describe('Files Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });


    describe('GET /files/:path?', () => {

        describe('given path points to directory', () => {

            const expectedFileListStructure = [
                'name', 'isDirectory'
            ]

            const delim = `x--x`
            const directoryPathDelim = `EXAM_SUBMISSION${delim}extracted${delim}55`

            it('should return status code 200 with fileList json', async () => {
                const getRequestPathRes = await getRequestPath(agent, directoryPathDelim)
                expect(getRequestPathRes.statusCode).toBe(200)

                const fileList = getRequestPathRes.body

                fileList.forEach((file) => {
                    expectedFileListStructure.forEach((expectedProperty) => {
                        expect(file).toHaveProperty(expectedProperty)
                    })
                })


            })
        })

        describe('given path points to file', () => {

            let delim = `x--x`
            const filePathDelim = `EXAM_SUBMISSION${delim}extracted${delim}55${delim}testFolder${delim}test.txt`
            const filePathActual = `testUploads/EXAM_SUBMISSION/extracted/55/testFolder/test.txt`
            let expectedContent

            beforeAll(async () => {
                expectedContent = await fs.readFile(filePathActual, 'utf8')
            })

            it('should return status code 200 with fileContent', async () => {
                const getRequestPathRes = await getRequestPath(agent, filePathDelim)
                expect(getRequestPathRes.statusCode).toBe(200)
                expect(getRequestPathRes.body.toString()).toBe(expectedContent)

            })
        })
    })

})