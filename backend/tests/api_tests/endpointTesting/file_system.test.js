const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


describe('File System Suite', () => {
    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });


    describe('POST /file_system/upload', () => {

        it('zip attached < 50 MB, upload type valid, should return 201 with file system id ', async () => {
            const filePathToUpload = path.join(mockFolderPath, 'file_system_mocks/EXAM_MODEL_ANSWER-asd.zip')
            const response = await agent
                .post('/file_system/upload')
                .attach('file', filePathToUpload)
                .field('uploadType', 'EXAM_SUBMISSION')
                .catch(err => {
                    console.error('Request failed:', err);
                    throw err;
                });
            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('file_system_id')
            expect(typeof response.body.file_system_id).toBe('number');
        })

        it('zip attached < 50 MB, upload type not attached, should return 500', async () => {
            const filePathToUpload = path.join(mockFolderPath, 'file_system_mocks/EXAM_MODEL_ANSWER-asd.zip')
            const response = await agent
                .post('/file_system/upload')
                .attach('file', filePathToUpload)
                .catch(err => {
                    console.error('Request failed:', err);
                    throw err;
                });
            expect(response.statusCode).toBe(500)
        })


    })

})
