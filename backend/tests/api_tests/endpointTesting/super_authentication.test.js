
const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions')

const { createNewSuperUser, deleteSuperUser, loginSuperUser } = require('../../utils/superAuthenticationFunctions');
const { getAllSuperUsers } = require('../../utils/superUserFunctions');

describe('Super Authentication Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });


    describe('/super_authentication', () => {

        describe('CREATE -> DELETE -> CHECK SUPER USERS', () => {

            const validEmail = `${Math.random()}email@email.com`
            const validName = `John Doe`
            const validPassword = `JohnPass1`

            // maybe need to fetch from db instead of hardcode?
            const validAccountCreationCode = `qub_admin_1234`

            const expectedUserProperties = [
                'super_user_id',
                'super_user_name',
                'super_user_email',
            ]


            let newlyCreatedUserId

            describe('POST /create', () => {
                describe('given valid email, name, password, accountCreationCode', () => {
                    it('should return status code 201 with jwt and user information', async () => {
                        const createNewSuperUserRes = await createNewSuperUser(agent, validEmail, validName, validPassword, validAccountCreationCode)
                        expect(createNewSuperUserRes.statusCode).toBe(201)
                        const { token, user } = createNewSuperUserRes.body
                        expect(!!token).toBe(true)
                        expectedUserProperties.forEach((property) => {
                            expect(user).toHaveProperty(property)
                        })
                        newlyCreatedUserId = user.super_user_id
                    })
                })
            })

            describe('POST /login', () => {
                describe('given valid login information from newly created user', () => {
                    it('should return status code 200 with jwt and user information', async () => {
                        const loginSuperUserRes = await loginSuperUser(agent, validEmail, validPassword)
                        expect(loginSuperUserRes.statusCode).toBe(200)
                        const { token, user } = loginSuperUserRes.body
                        expect(!!token).toBe(true)
                        expectedUserProperties.forEach((property) => {
                            expect(user).toHaveProperty(property)
                        })

                    })
                })
            })

            describe('DELETE /delete/:super_user_id', () => {
                describe('given valid super_user_id', () => {
                    it('should return status code 204', async () => {
                        const deleteSuperUserRes = await deleteSuperUser(agent, newlyCreatedUserId)
                        expect(deleteSuperUserRes.statusCode).toBe(204)
                    })
                })
            })

            describe('GET ../super_user/', () => {
                describe('given newly created super user just deleted', () => {
                    it('should return status code 200 with array omitting new user', async () => {
                        const getAllSuperUsersRes = await getAllSuperUsers(agent)
                        const superUsers = getAllSuperUsersRes.body
                        expect(getAllSuperUsersRes.statusCode).toBe(200)
                        expect(superUsers.some((su) => {
                            return su.super_user_id === newlyCreatedUserId
                        })).toBe(false)
                    })
                })
            })
        })







    })
})