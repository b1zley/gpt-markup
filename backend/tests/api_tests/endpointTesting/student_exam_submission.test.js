const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam, getResultsCSV } = require('../../utils/examFunctions');
const { addNewSES, getSESByEId, getSESBySESId, deleteSES, updateRCMarkInSES, updateRCCritiqueInSES, updateSES, markForTraining, unmarkForTraining, generateAiCritique } = require('../../utils/studentExamSubmissionFunctions');
const { addRubricByCSVUpload } = require('../../utils/rubricFunctions')


describe('Student Exam Submission Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    describe('/module/:module_id/exam/:exam_id/student_exam_submission', () => {
        let createdModuleId
        let createdExamId
        let createdSESId
        let createdRCId1
        let createdRCId2


        let createdModuleName = 'test module exam test'
        let createdExamName = 'test exam exam test'

        const csv_path = path.join(mockFolderPath, 'testRubricComponent.csv') // use for rubric upload

        let validStudentId = 1 // josh!


        let expectedSESShallowProperties
        let expectedSESDeepProperties

        // create module first
        beforeAll(async () => {
            createdModuleId = await createModule(agent, createdModuleName)
            const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
            createdExamId = createExamResponse.body.exam_id

            // should also add rubric components here...
            const addRubricByCSVUploadResponse = await addRubricByCSVUpload(agent, createdModuleId, createdExamId, csv_path)
            // console.log(addRubricByCSVUploadResponse.body)
            createdRCId1 = addRubricByCSVUploadResponse.body[0].rubric_component_id
            createdRCId2 = addRubricByCSVUploadResponse.body[1].rubric_component_id

            expectedSESShallowProperties = [
                "student_exam_submission_id",
                "marked_for_training",
                "exam_id",
                "student_id",
                "marker_mark",
                "file_system_id",
                "student_name",
                "student_number",
                `rubric_component_${createdRCId1}`,
                `rubric_component_${createdRCId2}`
            ]


            expectedSESDeepProperties = [
                "student_exam_submission_id",
                "exam_id",
                "is_locked",
                "student_id",
                "file_system_id",
                "module_id",
                "exam_name",
                "exam_question",
                "prompt_specifications",
                "chosen_ai_model_id",
                "module_name",
                "student_name",
                "student_number",
                "rubric"
            ]




        })
        // tear down created module and exam
        afterAll(async () => {
            await deleteModule(agent, createdModuleId)
        })


        describe('ADD SUBMISSION -> GET EXAM SUBMISSIONS -> GET SUBMISSION -> DELETE SUBMISSION -> GET EXAM SUBMISSIONS', () => {
            describe('POST /', () => {
                describe('given valid mid, eid, sid', () => {
                    it('should return status 201 with student_exam_submission_id', async () => {
                        const addNewSESResponse = await addNewSES(agent, createdModuleId, createdExamId, validStudentId)
                        expect(addNewSESResponse.statusCode).toBe(201)
                        expect(addNewSESResponse.body).toHaveProperty('student_exam_submission_id')
                        createdSESId = addNewSESResponse.body.student_exam_submission_id
                    })
                })
            })


            describe('GET /', () => {
                describe('given just added ses to exam', () => {
                    it('should return status code 200 with array of student exam submission details', async () => {
                        const getSESByEIdRes = await getSESByEId(agent, createdModuleId, createdExamId)
                        expect(getSESByEIdRes.statusCode).toBe(200)
                        expectedSESShallowProperties.forEach((expectedProperty) => {
                            expect(getSESByEIdRes.body[0]).toHaveProperty(expectedProperty)
                        })
                    })
                })
            })

            describe('GET /:student_exam_submission_id', () => {
                describe('given just added ses to exam', () => {
                    it('should return status code 200 with deep information on student exam submission', async () => {
                        const getSESBySESIdRes = await getSESBySESId(agent, createdModuleId, createdExamId, createdSESId)
                        expect(getSESBySESIdRes.statusCode).toBe(200)
                        expectedSESDeepProperties.forEach((expectedProperty) => {
                            expect(getSESBySESIdRes.body).toHaveProperty(expectedProperty)
                        })
                    })
                })
            })


            describe('DELETE /:student_exam_submission_id', () => {
                describe('given correct mid, eid, sesid', () => {
                    it('should return status code 204 no content', async () => {
                        const deleteSESRes = await deleteSES(agent, createdModuleId, createdExamId, createdSESId)
                        expect(deleteSESRes.statusCode).toBe(204)
                    })
                })
            })


            describe('GET /', () => {
                describe('given SES just removed', () => {
                    it('should return status code 200 with empty array', async () => {
                        const getSESByEIdRes = await getSESByEId(agent, createdModuleId, createdExamId)
                        expect(getSESByEIdRes.statusCode).toBe(200)
                        expect(getSESByEIdRes.body).toStrictEqual([])
                    })
                })
            })
        })





        describe('CREATE SES -> UPDATE RC -> UPDATE file_system_id -> GET SES AND COMPARE', () => {
            let createdModuleId
            let createdExamId
            let createdSESId
            let createdRCId1
            let createdRCId2

            const rc1UpdatedMark = '2.00'
            const targetFileSystemId = 55

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'
            const csv_path = path.join(mockFolderPath, 'testRubricComponent.csv') // use for rubric upload

            let validStudentId = 1 // josh!

            beforeAll(async () => {
                // create module first
                createdModuleId = await createModule(agent, createdModuleName)
                // and exam
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                // should also add rubric components here...
                const addRubricByCSVUploadResponse = await addRubricByCSVUpload(agent, createdModuleId, createdExamId, csv_path)
                createdRCId1 = addRubricByCSVUploadResponse.body[0].rubric_component_id
                createdRCId2 = addRubricByCSVUploadResponse.body[1].rubric_component_id
                // add ses
                const addNewSESResponse = await addNewSES(agent, createdModuleId, createdExamId, validStudentId)
                createdSESId = addNewSESResponse.body.student_exam_submission_id
            })
            // tear down created module and exam
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            describe('PUT /:student_exam_submission_id/rubric_component/:rubric_component_id', () => {
                describe('given valid eid, mid, sesid, rcid', () => {
                    it('should return status code 200', async () => {
                        const updateRCMarkInSESRes = await updateRCMarkInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId1, rc1UpdatedMark)
                        expect(updateRCMarkInSESRes.statusCode).toBe(200)
                    })
                })
            })

            describe('PUT /:student_exam_submission_id', () => {
                describe('given valid eid, mid, sesid, body', () => {
                    it('should return status code 200', async () => {
                        const sesUpdateBody = {
                            file_system_id: targetFileSystemId
                        }
                        const updateSESRes = await updateSES(agent, createdModuleId, createdExamId, createdSESId, sesUpdateBody)
                        expect(updateSESRes.statusCode).toBe(200)
                    })
                })
            })

            describe('GET /:student_exam_submission_id', () => {
                describe('given just updated RC mark and fsid', () => {
                    it('should return updated rc mark', async () => {
                        const getSESBySESIdRes = await getSESBySESId(agent, createdModuleId, createdExamId, createdSESId)
                        expect(getSESBySESIdRes.statusCode).toBe(200)
                        // console.log(getSESBySESIdRes.body)
                        expect(getSESBySESIdRes.body.rubric[0].rubric_component_mark).toBe(rc1UpdatedMark)

                    })

                    it('should return updated fsid', async () => {
                        const getSESBySESIdRes = await getSESBySESId(agent, createdModuleId, createdExamId, createdSESId)
                        expect(getSESBySESIdRes.statusCode).toBe(200)
                        expect(getSESBySESIdRes.body.file_system_id).toBe(targetFileSystemId)
                    })
                })
            })
        })


        describe('CREATE SES -> MARK FOR TRAINING -> GET -> UNMARK FOR TRAINING -> GET', () => {
            let createdModuleId
            let createdExamId
            let createdSESId
            let createdRCId1
            let createdRCId2


            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'
            const csv_path = path.join(mockFolderPath, 'testRubricComponent.csv') // use for rubric upload

            let validStudentId = 1 // josh!

            beforeAll(async () => {
                // create module first
                createdModuleId = await createModule(agent, createdModuleName)
                // and exam
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                // should also add rubric components here...
                const addRubricByCSVUploadResponse = await addRubricByCSVUpload(agent, createdModuleId, createdExamId, csv_path)
                createdRCId1 = addRubricByCSVUploadResponse.body[0].rubric_component_id
                createdRCId2 = addRubricByCSVUploadResponse.body[1].rubric_component_id
                // add ses
                const addNewSESResponse = await addNewSES(agent, createdModuleId, createdExamId, validStudentId)
                createdSESId = addNewSESResponse.body.student_exam_submission_id



            })
            // tear down created module and exam
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })
            describe('PUT /:student_exam_submission_id/marked_for_training', () => {
                describe('given valid mid,eid,sesid', () => {
                    it('should return status code 200', async () => {
                        const markForTrainingRes = await markForTraining(agent, createdModuleId, createdExamId, createdSESId)
                        expect(markForTrainingRes.statusCode).toBe(200)
                    })
                })

            })

            describe('GET /:student_exam_submission_id', () => {
                describe('given just marked for training', () => {
                    it('should return status code 200 with marked_for_training === 1', async () => {
                        const getSESByEIdRes = await getSESByEId(agent, createdModuleId, createdExamId)
                        expect(getSESByEIdRes.statusCode).toBe(200)
                        expect(getSESByEIdRes.body[0].marked_for_training).toBe(1)
                    })
                })
            })

            describe('DELETE /:student_exam_submission_id/marked_for_training', () => {
                describe('given valid mid, eid, sesid', () => {
                    it('should return status code 200', async () => {
                        const unmarkForTrainingRes = await unmarkForTraining(agent, createdModuleId, createdExamId, createdSESId)
                        expect(unmarkForTrainingRes.statusCode).toBe(200)
                    })
                })
            })

            describe('GET /:student_exam_submission_id', () => {
                describe('given just unmarked for training', () => {
                    it('should return status code 200 with marked_for_training === 0', async () => {
                        const getSESByEIdRes = await getSESByEId(agent, createdModuleId, createdExamId)
                        expect(getSESByEIdRes.statusCode).toBe(200)
                        expect(!!getSESByEIdRes.body[0].marked_for_training).toBe(false)
                    })
                })
            })


        })


        describe('CREATE SES -> ADD RESULTS -> GENERATE RESULTS CSV', () => {
            let createdModuleId
            let createdExamId
            let createdSESId
            let createdRCId1
            let createdRCId2


            let rc1UpdatedMark = '2.00'
            let rc2UpdatedMark = '3.00'

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'
            const csv_path = path.join(mockFolderPath, 'testRubricComponent.csv') // use for rubric upload

            let validStudentId = 1 // josh!
            let validStudentName = `Joshua O'Hagan`
            let validStudentNumber = '40100099'

            beforeAll(async () => {
                // create module first
                createdModuleId = await createModule(agent, createdModuleName)
                // and exam
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                // should also add rubric components here...
                const addRubricByCSVUploadResponse = await addRubricByCSVUpload(agent, createdModuleId, createdExamId, csv_path)
                createdRCId1 = addRubricByCSVUploadResponse.body[0].rubric_component_id
                createdRCId2 = addRubricByCSVUploadResponse.body[1].rubric_component_id
                // add ses
                const addNewSESResponse = await addNewSES(agent, createdModuleId, createdExamId, validStudentId)
                createdSESId = addNewSESResponse.body.student_exam_submission_id
                // update marks
                await updateRCMarkInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId1, rc1UpdatedMark)
                await updateRCMarkInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId2, rc2UpdatedMark)
            })
            // tear down created module and exam
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            describe('GET ../:exam_id/results_csv', () => {
                describe('given student marks added', () => {
                    it('should generate and return a results csv with correct name, containing updated results row', async () => {
                        const getResultsCSVRes = await getResultsCSV(agent, createdModuleId, createdExamId)
                        expect(getResultsCSVRes.status).toBe(200);
                        expect(getResultsCSVRes.headers['content-type']).toBe('text/csv; charset=utf-8');
                        expect(getResultsCSVRes.headers['content-disposition']).toContain(`attachment;filename=examResults-${createdExamId}.csv`);
                        const csvString = getResultsCSVRes.text
                        const lines = csvString.split('\n')
                        // validate first line formatting
                        const line0 = lines[0]
                        const expectedLine0Format = 'student_name, student_number,rubric_component_mark_1, rubric_component_critique_1,rubric_component_mark_2, rubric_component_critique_2'
                        expect(line0).toBe(expectedLine0Format)
                        // validate data
                        const line1 = lines[1]
                        const expectedLine1Format = `${validStudentName},${validStudentNumber},\"${rc1UpdatedMark}\",\"null\",\"${rc2UpdatedMark}\",\"null\"`
                        expect(line1).toBe(expectedLine1Format)
                    })
                })
            })
        })

        describe('CREATE SES -> ADD RESULTS AND PARAMS -> GENERATE AI RESULTS', () => {
            let createdModuleId
            let createdExamId
            let createdSESId
            let createdRCId1
            let createdRCId2

            let validStudentId = 1 // josh!
            let validStudentFileSystemId = 55

            let secondStudentId = 2 // some guy?
            let secondCreatedSESId

            let rc1UpdatedMark = '2.00'
            let rc2UpdatedMark = '3.00'

            let rc1UpdatedText = 'This is example text for rc 1 student 1'
            let rc2UpdatedText = 'This is example text for rc 1 student 1'

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'
            const csv_path = path.join(mockFolderPath, 'testRubricComponent.csv') // use for rubric upload



            beforeAll(async () => {
                // create module first
                createdModuleId = await createModule(agent, createdModuleName)
                // and exam
                const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                createdExamId = createExamResponse.body.exam_id
                // should also add rubric components here...
                const addRubricByCSVUploadResponse = await addRubricByCSVUpload(agent, createdModuleId, createdExamId, csv_path)
                createdRCId1 = addRubricByCSVUploadResponse.body[0].rubric_component_id
                createdRCId2 = addRubricByCSVUploadResponse.body[1].rubric_component_id

                // add other necessary params for exam
                const examUpdateBody = {
                    exam_question: 'example question',
                    file_system_id: 128,
                    prompt_specifications: 'test prompt',
                    is_locked: 1
                }
                await updateExam(agent, createdModuleId, createdExamId, examUpdateBody)


                // add ses
                const addNewSESResponse = await addNewSES(agent, createdModuleId, createdExamId, validStudentId)
                createdSESId = addNewSESResponse.body.student_exam_submission_id

                // add file system id
                const validStudentFileSystemIdPutBody = {
                    file_system_id: validStudentFileSystemId
                }
                const validStudentFileSystemRes = await updateSES(agent, createdModuleId, createdExamId, createdSESId, validStudentFileSystemIdPutBody)
                
                // update marks
                await updateRCMarkInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId1, rc1UpdatedMark)
                await updateRCMarkInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId2, rc2UpdatedMark)

                // also update text critique for each
                await updateRCCritiqueInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId1, rc1UpdatedText)
                await updateRCCritiqueInSES(agent, createdModuleId, createdExamId, createdSESId, createdRCId2, rc2UpdatedText)

                // mark valid for training
                await markForTraining(agent, createdModuleId, createdExamId, createdSESId)

                // add second student
                const addSecondStudentRes = await addNewSES(agent, createdModuleId, createdExamId, secondStudentId)
                secondCreatedSESId = addSecondStudentRes.body.student_exam_submission_id
                // update file system id
                const secondStudentFileSystemRes = await updateSES(agent, createdModuleId, createdExamId, secondCreatedSESId, validStudentFileSystemIdPutBody)

            })
            // tear down created module and exam
            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })


            describe('POST /:student_exam_submission_id/ai', () => {
                describe('given exam params set valid and example submission marked for training', () => {
                    it('should return status 201 with updated student exam submission', async () => {
                        const generateAiCritiqueRes = await generateAiCritique(agent, createdModuleId, createdExamId, secondCreatedSESId)
                        expect(generateAiCritiqueRes.statusCode).toBe(201)
                        const rubric = generateAiCritiqueRes.body.rubric
                        for (const rubricComponent of rubric) {
                            const { ai_critique, ai_mark } = rubricComponent
                            expect(!!ai_mark).toBe(true)
                            expect(!!ai_critique).toBe(true)
                        }
                    })
                })
            })
        })










    })

})