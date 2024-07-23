
const { getAuthenticatedAgent } = require('../utils/loggedInUserAgent');
const createApp = require('../../app')
const request = require('supertest');
const { db } = require('../../routesCommonDependencies'); // Ensure this path is correct


const app = createApp()
/**
 * test suite for testing protected routes correctly return unauthorized when user is not logged in
 */
describe('Protected Routes: ', () => {
    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()

    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    describe(`/file_system:`, () => {
        it('should access protected route', async () => {
            const response = await agent.get('/file_system/90')
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get('/file_system')
            expect(response.statusCode).toBe(401)
        })
    })


    describe('/module: ', () => {
        it('should access protected route', async () => {
            const response = await agent.get('/module')
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get('/module')
            expect(response.statusCode).toBe(401)
        })
    })

    describe('/ai_model', () => {
        it('should access protected route', async () => {
            const response = await agent.get('/ai_model')
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get('/ai_model')
            expect(response.statusCode).toBe(401)
        })
    })


    describe('/super_user', () => {
        it('should access protected route', async () => {
            const response = await agent.get('/super_user')
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get('/super_user')
            expect(response.statusCode).toBe(401)
        })
    })

    describe('/student', () => {
        it('should access protected route', async () => {
            const response = await agent.get('/student/search')
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get('/student/search')
            expect(response.statusCode).toBe(401)
        })
    })

    describe('/convert', () => {
        // need a file as part of the post to access this protected route
        const path = require('path')
        it('should access protected route', async () => {
            const response = await agent
                .post('/convert/RtfToPlainText')
                .attach('file', path.join(__dirname, '../__mocks__/testRTF.rtf'))

            // console.log(response.statusCode)
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get('/convert/RtfToPlainText')
            expect(response.statusCode).toBe(401)
        })
    })

    describe('/files', () => {
        const targetPath = 'EXAM_SUBMISSIONx--xextractedx--x55'
        it('should access protected route', async () => {
            const response = await agent
                .get(`/files/${targetPath}`)

            // console.log(response.statusCode)
            expect(response.statusCode).toBe(200)
        })
        it('should not access protected route', async () => {
            const response = await request(app).get(`/files/${targetPath}`)
            expect(response.statusCode).toBe(401)
        })
    })
})