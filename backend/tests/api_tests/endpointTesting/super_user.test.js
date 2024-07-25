const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions');
const { getModels } = require('../../utils/aiModelFunctions');
const { getAllSuperUsers, addLecturerToModule, examSearch, getSuperUsersByTypeId, getSuperUsersInModule, deleteSuperUserFromModule } = require('../../utils/superUserFunctions');


describe('Super User Suite', () => {

    let agent;
    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    describe('/super_user', () => {


        describe('GET ALL SUPER USERS', () => {

            const expectedSuperUserProperties = [
                'super_user_id',
                'super_user_name',
                'super_user_type_name',
                'access_rights'
            ]

            describe('GET /', () => {
                it('should return status code 200 with array of all super users stored in db with correct format', async () => {
                    const getAllSuperUsersRes = await getAllSuperUsers(agent)
                    expect(getAllSuperUsersRes.statusCode).toBe(200)
                    const superUsers = getAllSuperUsersRes.body
                    superUsers.forEach((superUser) => {
                        expectedSuperUserProperties.forEach((expectedProperty) => {
                            expect(superUser).toHaveProperty(expectedProperty)
                        })
                    })

                })
            })
        })


        describe('CREATE EXAM -> ADD LECTURER -> ADD MARKER -> EXAM SEARCH', () => {

            let createdModuleId
            let createdExamId

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'

            const validLecturerId = 3
            const validMarkerId = 2
            const validAdministratorId = 1

            // add marker to exam as well
            // router.post('/:exam_id/super_user', examControllers.requestHandlerPostSuperUserInExam)


            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                const addSuperUserToExamRes = await addSuperUserToExam(agent, createdModuleId, createdExamId, validMarkerId)
                // console.log(addSuperUserToExamRes.body)
            })

            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            // add lecturer
            describe('POST /module/:module_id/lecturer', () => {
                describe('given valid mid and super_user_id', () => {
                    it('should return status code 201 with module_super_user_id', async () => {
                        const addLecturerToModuleRes = await addLecturerToModule(agent, createdModuleId, validLecturerId)
                        expect(addLecturerToModuleRes.statusCode).toBe(201)
                        expect(addLecturerToModuleRes.body).toHaveProperty('module_super_user_id')
                    })
                })
            })




            describe('GET /exam_search', () => {
                const expectedProperties = [
                    'super_user_id',
                    'super_user_name',
                    'super_user_type_name',
                    'super_user_type_id',
                    'access_rights'
                ]


                describe('given lecturer added and marker added', () => {
                    it('should return status code 200 with array of super users, including lecturer, marker and administrator', async () => {
                        const examSearchRes = await examSearch(agent, createdModuleId, createdExamId)
                        expect(examSearchRes.statusCode).toBe(200)
                        const superUsersWithAccess = examSearchRes.body
                        superUsersWithAccess.forEach((user) => {
                            expectedProperties.forEach((ep) => {
                                expect(user).toHaveProperty(ep)
                            })
                        })
                        // check for marker
                        expect(superUsersWithAccess.some((user) => {
                            return user.super_user_id === validMarkerId
                        })).toBe(true)
                        // check for lecturer
                        expect(superUsersWithAccess.some((user) => {
                            return user.super_user_id === validLecturerId
                        })).toBe(true)
                        // check for administrator
                        expect(superUsersWithAccess.some((user) => {
                            return user.super_user_id === validAdministratorId
                        })).toBe(true)
                    })
                })
            })

        })

        describe('GET /super_user_type_id/:super_user_type_id', () => {

            const typeCodes = {
                'admin': 1,
                'marker': 2,
                'lecturer': 3
            }

            const checkSuperUserType = (superUserObject) => {

                describe(`given super_user_type_id === ${superUserObject.super_user_type_id}`, () => {
                    it(`should return status code 200 with array of ${superUserObject.super_user_type_name}s`, async () => {
                        const expectedType = superUserObject.super_user_type_id
                        const getSuperUsersByTypeIdRes = await getSuperUsersByTypeId(agent, expectedType)
                        expect(getSuperUsersByTypeIdRes.statusCode).toBe(200)
                        const superUsers = getSuperUsersByTypeIdRes.body
                        superUsers.forEach((user) => {
                            expect(user.super_user_type_id).toBe(expectedType)
                        })
                    })
                })
            }

            // checkSuperUserType(typeCodes.admin)
            const checkSuperUserTypes = (typeCodes) => {

                const superUserTypeKeys = Object.keys(typeCodes)

                for (const typeKey of superUserTypeKeys) {
                    const superUserObject = {
                        super_user_type_id: typeCodes[typeKey],
                        super_user_type_name: typeKey
                    }

                    checkSuperUserType(superUserObject)

                }


            }

            checkSuperUserTypes(typeCodes)

        })

        describe('ADD LECTURER TO MODULE -> GET MODULE -> DELETE LECTURER FROM MODULE -> GET MODULE', () => {

            let createdModuleId
            let createdExamId
            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'
            const validLecturerId = 3

            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id

                // add lecturer to module
                await addLecturerToModule(agent, createdModuleId, validLecturerId)
                
            })

            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            describe('GET /module/:module_id', () => {
                describe('given lecturer added to module', () => {
                    it('should return status code 200 with array of super users including lecturer', async () => {
                        const getSuperUsersInModuleRes = await getSuperUsersInModule(agent, createdModuleId)
                        expect(getSuperUsersInModuleRes.statusCode).toBe(200)
                        expect(getSuperUsersInModuleRes.body.some((su) => {
                            return su.super_user_id === validLecturerId
                        })).toBe(true)

                    })
                })
            })

            describe('DELETE /module/:module_id/lecturer/:super_user_id', () => {
                describe('given valid super_user_id and mid', () =>{
                    it('should return status code 204', async () => {
                        const deleteSuperUserFromModuleRes = await deleteSuperUserFromModule(agent, createdModuleId, validLecturerId)
                        expect(deleteSuperUserFromModuleRes.statusCode).toBe(204)
                    })
                })
            })

            describe('GET /module/:module_id', () => {
                describe('given lecturer just removed from module' , ()=> {
                    it('should return status code 200 with array missing lecturer', async () => {
                        const getSuperUsersInModuleRes = await getSuperUsersInModule(agent, createdModuleId)
                        expect(getSuperUsersInModuleRes.statusCode).toBe(200)
                        const superUsers = getSuperUsersInModuleRes.body
                        expect(superUsers.some((su) => {
                            return su.super_user_id === validLecturerId
                        })).toBe(false)
                    })
                })
            })


        })
    })
})