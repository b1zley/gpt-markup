const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions')

const { addNewRcToExam, updateRc, getRC, deleteRC, addRRToRc, updateRRInRc, deleteRRInRc, createNewRRInRcComplete, addRubricByCSVUpload } = require('../../utils/rubricFunctions')


describe('Rubric Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    describe('/module/:module_id/exam/:exam_id/rubric', () => {
        let createdModuleId
        let createdExamId
        let createdRCId

        let createdModuleName = 'test module rubric test'
        let createdExamName = 'test exam rubric test'
        let createdRubricName = 'test rc rubric test'

        let updatedRCDesc = "testDesc"
        // create module first
        beforeAll(async () => {
            createdModuleId = await createModule(agent, createdModuleName)
            const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
            createdExamId = createExamResponse.body.exam_id
        })
        // tear down created module and exam
        afterAll(async () => {
            await deleteModule(agent, createdModuleId)
        })

        describe('ADD RC -> UPDATE RC -> GET RC -> DELETE RC -> GET EXAM', () => {
            describe('POST /', () => {
                describe('given valid module_id, exam_id, rc_name', () => {
                    it('should return status code 201 with new rubric componenet id ', async () => {
                        const addNewRcToExamResponse = await addNewRcToExam(agent, createdModuleId, createdExamId, createdRubricName)
                        expect(addNewRcToExamResponse.statusCode).toBe(201)
                        expect(addNewRcToExamResponse.body).toHaveProperty('rubric_component_id')
                        createdRCId = addNewRcToExamResponse.body.rubric_component_id
                    })
                })
            })

            describe('PUT /:rubric_component_id', () => {
                describe('given valid module_id, exam_id, rc_id and update body', () => {
                    it('should respond status code 200', async () => {
                        const updateBody = {
                            rubric_component_desc: updatedRCDesc
                        }
                        const updateRcResponse = await updateRc(agent, createdModuleId, createdExamId, createdRCId, updateBody)
                        expect(updateRcResponse.statusCode).toBe(200)
                    })
                })
            })

            describe('GET /:rubric_component_id', () => {
                describe('given rubric component just updated', () => {
                    it('should return status code 200 with rubric component information', async () => {
                        const getRCResponse = await getRC(agent, createdModuleId, createdExamId, createdRCId)
                        const expectedData = {
                            rubric_component_id: createdRCId,
                            name: createdRubricName,
                            rubric_component_desc: updatedRCDesc,
                            maximum: null,
                            exam_id: createdExamId,
                            module_id: createdModuleId,
                            exam_name: createdExamName,
                            exam_question: null,
                            file_system_id: null,
                            prompt_specifications: null,
                            chosen_ai_model_id: 3,
                            is_locked: null,
                            temperature: 0,
                            top_p: 0,
                            top_p_mode: null,
                            module_name: createdModuleName,
                            rating_ranges: []
                        }
                        expect(getRCResponse.statusCode).toBe(200)
                        expect(getRCResponse.body).toEqual(expectedData)
                    })
                })
            })

            describe('DELETE /:rubric_component_id', () => {
                describe('given rc present in database', () => {
                    it('should return status code 204 no content', async () => {
                        const deleteRCResponse = await deleteRC(agent, createdModuleId, createdExamId, createdRCId)
                        expect(deleteRCResponse.statusCode).toBe(204)
                    })
                })
            })

            describe('CHECK EXAM THAT RC HAS BEEN DELETED', () => {
                describe('given rc removed from database', () => {
                    it('should return status code 200 with exam information, with rubric missing', async () => {
                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        expect(getExamResponse.statusCode).toBe(200)
                        const rubricInExamIsEmpty = getExamResponse.body.rubric.length === 0
                        expect(rubricInExamIsEmpty).toBe(true)
                    })
                })
            })


        })

        describe('ADD RC -> ADD RATING RANGE -> UPDATE RATING RANGE -> GET RC -> DELETE RATING RANGE -> GET RC', () => {
            let createdModuleId
            let createdExamId
            let createdRCId
            let createdRRId

            let createdModuleName = 'test module rubric test'
            let createdExamName = 'test exam rubric test'
            let createdRubricName = 'test rc rubric test'
            let updatedRatingDesc = 'test updated rating desc rubric test'

            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                const addNewRcToExamResponse = await addNewRcToExam(agent, createdModuleId, createdExamId, createdRubricName)
                createdRCId = addNewRcToExamResponse.body.rubric_component_id
            })
            // tear down created module and exam (and implicitly rc)
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            describe('POST /:rubric_component_id/rating_range', () => {
                describe('given valid module_id, exam_id, rcid', () => {
                    it('should return status code 201 with created rating_range_id', async () => {
                        const addRRToRcResponse = await addRRToRc(agent, createdModuleId, createdExamId, createdRCId)
                        expect(addRRToRcResponse.statusCode).toBe(201)
                        expect(addRRToRcResponse.body).toHaveProperty('rating_range_id')
                        createdRRId = addRRToRcResponse.body.rating_range_id
                    })
                })
            })

            describe('PUT /:rubric_component_id/rating_range/:rating_range_id', () => {
                describe('given valid mid, eid, rcid, rrid, putbody', () => {
                    it('should return status code 200 ok', async () => {
                        const putBody = {
                            rating_desc: updatedRatingDesc
                        }
                        const updateRRInRcResponse = await updateRRInRc(agent, createdModuleId, createdExamId, createdRCId, createdRRId, putBody)
                        expect(updateRRInRcResponse.statusCode).toBe(200)

                    })
                })
            })

            describe('GET /:rubric_component_id', () => {
                describe('given rubric component just updated', () => {
                    it('should return status code 200 with rating range added and updated', async () => {
                        const getRCResponse = await getRC(agent, createdModuleId, createdExamId, createdRCId)
                        expect(getRCResponse.statusCode).toBe(200)
                        expect(getRCResponse.body.rating_ranges[0].rating_desc).toBe(updatedRatingDesc)
                    })
                })
            })

            describe('DELETE /:rubric_component_id/rating_range/:rating_range_id', () => {
                describe('given mid, eid, rcid, rrid valid', () => {
                    it('should return status code 204', async () => {
                        const deleteRRInRcResponse = await deleteRRInRc(agent, createdModuleId, createdExamId, createdRCId, createdRRId)
                        expect(deleteRRInRcResponse.statusCode).toBe(204)
                    })
                })
            })

            describe('GET /:rubric_component_id', () => {
                describe('given rubric component just removed', () => {
                    it('should return status code 200 with rating range removed', async () => {
                        const getRCResponse = await getRC(agent, createdModuleId, createdExamId, createdRCId)
                        expect(getRCResponse.statusCode).toBe(200)
                        const rrRemoved = getRCResponse.body.rating_ranges.length === 0
                        expect(rrRemoved).toBe(true)
                    })
                })
            })



        })


        describe('ADD RR IN RC -> GET RC', () => {
            let createdModuleId
            let createdExamId
            let createdRCId
            let createdRRId


            let createdModuleName = 'test module rubric test'
            let createdExamName = 'test exam rubric test'
            let createdRubricName = 'test rc rubric test'


            const postBody = {
                rating_desc: 'test rating desc',
                rating_min_incl: '0.00',
                rating_max_incl: '1.00'
            }

            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                const addNewRcToExamResponse = await addNewRcToExam(agent, createdModuleId, createdExamId, createdRubricName)
                createdRCId = addNewRcToExamResponse.body.rubric_component_id
            })
            // tear down created module and exam (and implicitly rc)
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            describe('POST /:rubric_component_id/rating_range/complete', () => {
                describe('given mid, eid, rcid, postBody valid', () => {
                    it('should return status code 201 with rating_range_id', async () => {
                        const createNewRRInRcCompleteResponse = await createNewRRInRcComplete(agent, createdModuleId, createdExamId, createdRCId, postBody)
                        expect(createNewRRInRcCompleteResponse.statusCode).toBe(201)
                        expect(createNewRRInRcCompleteResponse.body).toHaveProperty('rating_range_id')
                        createdRRId = createNewRRInRcCompleteResponse.body.rating_range_id
                    })
                })
            })

            describe('GET /:rubric_component_id', () => {
                describe('given rating range just added', () => {
                    it('should return status code 200 with rating range appropriately added', async () => {
                        const getRCResponse = await getRC(agent, createdModuleId, createdExamId, createdRCId)
                        expect(getRCResponse.statusCode).toBe(200)
                        const expectedData = {
                            ...postBody,
                            rating_range_id: createdRRId,
                            rubric_component_id: createdRCId
                        }
                        expect(getRCResponse.body.rating_ranges[0]).toEqual(expectedData)
                    })
                })
            })
        })


        describe('ADD RCS FROM CSV -> GET EXAM + COMPARE RCS', () => {
            let createdModuleId
            let createdExamId

            let createdModuleName = 'test module rubric test'
            let createdExamName = 'test exam rubric test'

            const csv_path = path.join(mockFolderPath, 'testRubricComponent.csv')

            let expectedRubricArray




            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id

                expectedRubricArray = [
                    {
                        name: 'Program Functionality',
                        rubric_component_desc: 'This is the description for program functionality',
                        maximum: '6.00',
                        exam_id: createdExamId,
                        rating_ranges: expect.any(Array)
                    },
                    {
                        name: 'ANOTHER COMPONENT',
                        rubric_component_desc: 'This is another component desc',
                        maximum: '1.00',
                        exam_id: createdExamId,
                        rating_ranges: expect.any(Array)
                    }
                ]

            })
            // tear down created module and exam (and implicitly rc)
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })


            describe('POST /csv_upload', () => {
                describe('given csv in correct format, mid,eid correct', () => {
                    it('should return status code 201 with newly added rubric component array', async () => {
                        const addRubricByCSVUploadResponse = await addRubricByCSVUpload(agent, createdModuleId, createdExamId, csv_path)




                        expect(addRubricByCSVUploadResponse.body).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining(expectedRubricArray[0]),
                                expect.objectContaining(expectedRubricArray[1])
                            ])
                        )
                        expect(addRubricByCSVUploadResponse.statusCode).toBe(201)

                    })
                })
            })


            describe('GET ../../exam', () => {

                describe('given CSV upload has added new rubric components', () => {
                    it('should return status code 200 with new rubric components visible', async () => {
                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        expect(getExamResponse.body.rubric).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining(expectedRubricArray[0]),
                                expect.objectContaining(expectedRubricArray[1])
                            ])
                        )
                        expect(getExamResponse.statusCode).toBe(200)
                    })
                })
            })
        })




    })




})