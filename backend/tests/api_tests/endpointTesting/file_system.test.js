const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct


describe('File System Suite', () => {
    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()

    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });


    describe('POST /file_system/upload', () => {

        it('zip attached < 50 MB should return 201 with file system id ', () => {
            



        })


    })

})
