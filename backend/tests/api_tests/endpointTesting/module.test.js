const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')

const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed


describe('Module Suite', () => {
    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });


    describe('GET /module/id', () => {
        it('should return an array of integers with status code 200', async () => {
            const getUrl = '/module/id'
            const response = await agent.get(getUrl)
            expect(response.body).toBeInstanceOf(Array);
            response.body.forEach((element) => {
                expect(Number.isInteger(element)).toBe(true)
            })
            expect(response.statusCode).toBe(200)
        })
    })



    let createdModuleId;
    let createdModuleName = 'created test module'
    describe('POST /module', () => {
        it('should return status code 201 with created module_id in response from valid input', async () => {
            const postUrl = '/module'
            const postBody = { module_name: createdModuleName }
            const response = await agent.post(postUrl)
                .send(postBody)
            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('module_id')
            expect(typeof response.body.module_id).toBe('number')
            createdModuleId = response.body.module_id
        })
    })


    describe('DELETE module/:module_id', () => {
        it('should return status code 204 when targeted module_id is within database', async () => {
            const delUrl = `/module/${createdModuleId}`
            const response = await agent.delete(delUrl)
            expect(response.statusCode).toBe(204)
        })

        it('should remove target module from the database, so GET at this resource should return empty array', async () => {
            const getUrl = `/module/${createdModuleId}`
            const response = await agent.get(getUrl)
            expect(response.statusCode).toBe(200)
            const expectedFormat = []
            expect(response.body).toEqual(expectedFormat)
        })
    })

    describe('GET /module/:module_id', () => {
        it('should return status code 200 with module information as object when module_id is present in database', async () => {

            // create new module
            const modulePostUrl = '/module'
            const modulePostBody = { module_name: createdModuleName }
            const moduleCreateResponse = await agent.post(modulePostUrl)
                .send(modulePostBody)
            const createdModuleId = moduleCreateResponse.body.module_id

            const moduleGetUrl = `/module/${createdModuleId}`
            const moduleGetResponse = await agent.get(moduleGetUrl)
            const actualResponseBody = moduleGetResponse.body[0]

            expect(moduleGetResponse.statusCode).toBe(200)
            expect(actualResponseBody).toHaveProperty('module_id')
            expect(actualResponseBody).toHaveProperty('module_name')
            expect(actualResponseBody.module_name).toBe(createdModuleName)


            // tear down
            await agent.delete(`/module/${createdModuleId}`)
        })

    })

    describe('GET /module', () => {

        it('should return status code 200 with all modules in db, along with all exams in db', async () => {
            // create new module
            const modulePostUrl = '/module'
            const modulePostBody = { module_name: createdModuleName }
            const moduleCreateResponse = await agent.post(modulePostUrl)
                .send(modulePostBody)
            const createdModuleId = moduleCreateResponse.body.module_id
            // console.log(createdModuleId)
            // create exam for that module
            const createdExamName = 'test created exam'
            const examPostUrl = `/module/${createdModuleId}/exam`
            const examPostBody = {
                exam_name: createdExamName
            }

            const examCreateResponse = await agent.post(examPostUrl).send(examPostBody)
            const createdExamId = examCreateResponse.body.exam_id

            // get modules

            const modulesResponse = await agent.get(modulePostUrl)


            // verify modules response contains created module
            // console.log(modulesResponse.body)

            const createdModuleWithinModulesIndex = modulesResponse.body.findIndex((element) => {
                // console.log(element.module_id)
                return element.module_id === createdModuleId
            })

            expect(createdModuleWithinModulesIndex !== -1).toBe(true)
            const examsWithinCreatedModule = modulesResponse.body[createdModuleWithinModulesIndex].exams
            const createdExamWithinCreatedModule = examsWithinCreatedModule.some((element) => {
                return element.exam_id === createdExamId
            })
            expect(createdExamWithinCreatedModule).toBe(true)
            // tear down
            await agent.delete(`/module/${createdModuleId}`)
        })


    })

    describe('GET /module/:module_id/super_user_id/:super_user_id', () => {

        it('should return status code 200 with information on super_users assigned to module', async () => {
            const newModuleName = 'test module'
            const createdModuleId = await createModule(agent,newModuleName)

            const exampleLecturerId = 3
            await addSuperUserToModule(agent, createdModuleId, exampleLecturerId)

            // check if lecturer has access
            const response = await agent.get(`/module/${createdModuleId}/super_user_id/${exampleLecturerId}`)
            expect(response.body.length > 0).toBe(true)
            expect(response.statusCode).toBe(200)
            // tear down
            await deleteModule(agent, createdModuleId)
        })
    })


    


})








