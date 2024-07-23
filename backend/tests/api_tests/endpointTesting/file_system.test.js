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
            expect(response.statusCode).toBe(500)
        })
    })


    describe('GET /file_system/:file_system_id', () => {
        it('valid file system id should return status 200 with array length 0 of file system data', async () => {
            const validFileSystemId = 90
            const response = await agent.get(`/file_system/${validFileSystemId}`)
            const data = response.body
            expect(response.statusCode).toBe(200)
            const expectedFormat = [{
                unzip: 'EXAM_MODEL_ANSWER/extracted/90',
                zip: 'EXAM_MODEL_ANSWER/zips/90'
            }]
            expect(data).toStrictEqual(expectedFormat)
        })

        it('unlinked file system id should return status 200 with empty array', async () => {
            const invalidFileSystemId = -1
            const response = await agent.get(`/file_system/${invalidFileSystemId}`)
            const data = response.body
            expect(response.statusCode).toBe(200)
            const expectedFormat = []
            expect(data).toStrictEqual(expectedFormat)
        })
    })

    describe('GET /file_system/download_zip/:download_type/:file_system_id', () => {
        it('valid download type, valid file_system_id should return status 200 and download file', async () => {
            const validFileSystemId = 90
            const validDownloadType = 'EXAM_MODEL_ANSWER'
            const getUrl = `/file_system/download_zip/${validDownloadType}/${validFileSystemId}`
            const response = await agent.get(getUrl)
            expect(response.statusCode).toBe(200)
            // check file attached
            expect(response.headers['content-disposition']).toMatch(/attachment/);
        })

        it('invalid download type, invalid file_system_id should return status 404 with no file', async () => {
            const validFileSystemId = -1
            const validDownloadType = 'BAD_TYPE'
            const getUrl = `/file_system/download_zip/${validDownloadType}/${validFileSystemId}`
            const response = await agent.get(getUrl)
            expect(response.statusCode).toBe(404)
        })
    })
})
