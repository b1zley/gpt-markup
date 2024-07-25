
const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions');
const { getModels } = require('../../utils/aiModelFunctions');

describe('AI Model Suite', () => {

    let agent;

    const expectedProperties = [
        'trained_model_id',
        'api_id',       
        'prompt_engineering',
        'model_name'
    ]

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    describe('/ai_model', () => {
        describe('GET /', () => {
            it('should return status 200 with information on all ai models', async () => {
                const getModelsRes = await getModels(agent)
                expect(getModelsRes.statusCode).toBe(200)
                const aiModels = getModelsRes.body
                aiModels.forEach((aiModel) => {
                    expectedProperties.forEach((expectedProperty) => {
                        expect(aiModel).toHaveProperty(expectedProperty)
                    })
                })
            })
        })
    })

})

