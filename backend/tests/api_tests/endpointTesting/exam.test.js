
const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')


const { createModule, addSuperUserToModule, deleteModule } = require('../../utils/moduleFunctions'); // Adjust the path as needed

const { createNewExam, getExam, deleteExam, updateExam, getModulesExams, addSuperUserToExam, removeSuperUserFromExam, addFileTypeToExam, removeFileTypeFromExam } = require('../../utils/examFunctions')


describe('Exam Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });


    describe('/module/:module_id/exam', () => {

        describe('CREATE-> GET SPECIFIC -> UPDATE SPECIFIC -> GET SPECIFIC -> DESTROY -> GET SPECIFIC', () => {

            let createdModuleId
            let createdExamId

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'

            let updatedExamQuestion = 'this is an updated exam question'
            let updatedPromptSpecifications = 'this is updated prompt specifications'

            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
            })

            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })


            describe('POST /', () => {
                describe('given correct module_id, valid exam_name in post body', () => {
                    it('should respond 201 created with the created exam_id in json', async () => {
                        const createExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                        createdExamId = createExamResponse.body.exam_id

                        expect(createExamResponse.statusCode).toBe(201)
                        expect(createExamResponse.body).toHaveProperty('exam_id')
                        expect(typeof createExamResponse.body.exam_id).toBe('number')
                    })
                })
            })

            describe('GET /:exam_id', () => {
                describe('given correct module_id and createdExamId', () => {
                    it('should respond 200 ok with exam information in json', async () => {
                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        const expectedData = {
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
                            trained_model_id: 3,
                            api_id: 'claude-3-5-sonnet-20240620',
                            prompt_engineering: 'The exam you are marking will be delivered to you as an entire code project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.\n' +
                                'Please provide feedback and a mark for each rubric component in the following JSON format, only return valid, parseable JSON with escaped newlines, if there is only one rubric component, there should only be one element within the array.:\n' +
                                '[\n' +
                                '  {"aiFeedbackToParse": "example feedback for Part 1", "aiMarkToParse": 25.5},\n' +
                                '  {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28.0}\n' +
                                ']\n' +
                                'In your marking, you should not penalize overexplanation from the student in comments, as the purpose of the exam is to demonstrate knowledge and ability.\n' +
                                'The module you are marking for is a programming module, and you should judge student’s exam submissions based on the following information:\n' +
                                '\n' +
                                'IMPORTANT: When providing feedback, please adhere to the following guidelines to ensure compatibility with CSV formatting:\n' +
                                '1. Do not use line breaks or carriage returns within your feedback. Use spaces instead.\n' +
                                '2. Avoid using commas (,) in your feedback. Use semicolons (;) or other punctuation if needed.\n' +
                                `3. Do not use double quotes (") in your feedback. Use single quotes (') if necessary.\n` +
                                '4. Avoid using any special characters that might interfere with CSV parsing, such as |, \\, or /.\n' +
                                '\n' +
                                'Your feedback should be concise, clear, and informative while adhering to these formatting guidelines.',
                            model_name: 'Anthropic-Claude-3.5-Sonnet',
                            rubric: [],
                            fileTypes: [
                                { file_type_id: 1, file_type_extension: 'java', allowed: false },
                                { file_type_id: 2, file_type_extension: 'css', allowed: false },
                                { file_type_id: 3, file_type_extension: 'html', allowed: false },
                                { file_type_id: 4, file_type_extension: 'js', allowed: false },
                                { file_type_id: 5, file_type_extension: 'jsx', allowed: false },
                                { file_type_id: 6, file_type_extension: 'ejs', allowed: false }
                            ]
                        }

                        expect(getExamResponse.statusCode).toBe(200)
                        expect(getExamResponse.body).toEqual(expectedData)


                    })
                })


            })


            describe('PUT /:exam_id', () => {
                describe('given exam_id just created with valid put body', () => {
                    it('should respond status code 200 with updated exam as json', async () => {
                        const putBody = {
                            exam_question: updatedExamQuestion,
                            prompt_specifications: updatedPromptSpecifications
                        }

                        const putResponse = await updateExam(agent, createdModuleId, createdExamId, putBody)

                        const expectedData = {
                            exam_id: createdExamId,
                            module_id: createdModuleId,
                            exam_name: createdExamName,
                            exam_question: updatedExamQuestion,
                            file_system_id: null,
                            prompt_specifications: updatedPromptSpecifications,
                            chosen_ai_model_id: 3,
                            is_locked: null,
                            temperature: 0,
                            top_p: 0,
                            top_p_mode: null,
                            module_name: createdModuleName,
                            trained_model_id: 3,
                            api_id: 'claude-3-5-sonnet-20240620',
                            prompt_engineering: 'The exam you are marking will be delivered to you as an entire code project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.\n' +
                                'Please provide feedback and a mark for each rubric component in the following JSON format, only return valid, parseable JSON with escaped newlines, if there is only one rubric component, there should only be one element within the array.:\n' +
                                '[\n' +
                                '  {"aiFeedbackToParse": "example feedback for Part 1", "aiMarkToParse": 25.5},\n' +
                                '  {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28.0}\n' +
                                ']\n' +
                                'In your marking, you should not penalize overexplanation from the student in comments, as the purpose of the exam is to demonstrate knowledge and ability.\n' +
                                'The module you are marking for is a programming module, and you should judge student’s exam submissions based on the following information:\n' +
                                '\n' +
                                'IMPORTANT: When providing feedback, please adhere to the following guidelines to ensure compatibility with CSV formatting:\n' +
                                '1. Do not use line breaks or carriage returns within your feedback. Use spaces instead.\n' +
                                '2. Avoid using commas (,) in your feedback. Use semicolons (;) or other punctuation if needed.\n' +
                                `3. Do not use double quotes (") in your feedback. Use single quotes (') if necessary.\n` +
                                '4. Avoid using any special characters that might interfere with CSV parsing, such as |, \\, or /.\n' +
                                '\n' +
                                'Your feedback should be concise, clear, and informative while adhering to these formatting guidelines.',
                            model_name: 'Anthropic-Claude-3.5-Sonnet',
                            rubric: [],
                            fileTypes: [
                                { file_type_id: 1, file_type_extension: 'java', allowed: false },
                                { file_type_id: 2, file_type_extension: 'css', allowed: false },
                                { file_type_id: 3, file_type_extension: 'html', allowed: false },
                                { file_type_id: 4, file_type_extension: 'js', allowed: false },
                                { file_type_id: 5, file_type_extension: 'jsx', allowed: false },
                                { file_type_id: 6, file_type_extension: 'ejs', allowed: false }
                            ]
                        }

                        expect(putResponse.body).toEqual(expectedData)
                        expect(putResponse.statusCode).toBe(200)
                    })
                })
            })

            describe('GET /:exam_id', () => {
                describe('given exam_id just updated', () => {
                    it('should return status code 200 with updated body as response data', async () => {
                        const expectedData = {
                            exam_id: createdExamId,
                            module_id: createdModuleId,
                            exam_name: createdExamName,
                            exam_question: updatedExamQuestion,
                            file_system_id: null,
                            prompt_specifications: updatedPromptSpecifications,
                            chosen_ai_model_id: 3,
                            is_locked: null,
                            temperature: 0,
                            top_p: 0,
                            top_p_mode: null,
                            module_name: createdModuleName,
                            trained_model_id: 3,
                            api_id: 'claude-3-5-sonnet-20240620',
                            prompt_engineering: 'The exam you are marking will be delivered to you as an entire code project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.\n' +
                                'Please provide feedback and a mark for each rubric component in the following JSON format, only return valid, parseable JSON with escaped newlines, if there is only one rubric component, there should only be one element within the array.:\n' +
                                '[\n' +
                                '  {"aiFeedbackToParse": "example feedback for Part 1", "aiMarkToParse": 25.5},\n' +
                                '  {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28.0}\n' +
                                ']\n' +
                                'In your marking, you should not penalize overexplanation from the student in comments, as the purpose of the exam is to demonstrate knowledge and ability.\n' +
                                'The module you are marking for is a programming module, and you should judge student’s exam submissions based on the following information:\n' +
                                '\n' +
                                'IMPORTANT: When providing feedback, please adhere to the following guidelines to ensure compatibility with CSV formatting:\n' +
                                '1. Do not use line breaks or carriage returns within your feedback. Use spaces instead.\n' +
                                '2. Avoid using commas (,) in your feedback. Use semicolons (;) or other punctuation if needed.\n' +
                                `3. Do not use double quotes (") in your feedback. Use single quotes (') if necessary.\n` +
                                '4. Avoid using any special characters that might interfere with CSV parsing, such as |, \\, or /.\n' +
                                '\n' +
                                'Your feedback should be concise, clear, and informative while adhering to these formatting guidelines.',
                            model_name: 'Anthropic-Claude-3.5-Sonnet',
                            rubric: [],
                            fileTypes: [
                                { file_type_id: 1, file_type_extension: 'java', allowed: false },
                                { file_type_id: 2, file_type_extension: 'css', allowed: false },
                                { file_type_id: 3, file_type_extension: 'html', allowed: false },
                                { file_type_id: 4, file_type_extension: 'js', allowed: false },
                                { file_type_id: 5, file_type_extension: 'jsx', allowed: false },
                                { file_type_id: 6, file_type_extension: 'ejs', allowed: false }
                            ]
                        }


                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        expect(getExamResponse.statusCode).toBe(200)
                        expect(getExamResponse.body).toEqual(expectedData)




                    })
                })
            })

            describe('DELETE /:exam_id', () => {
                describe('given correct module_id and createdExamId', () => {
                    it('should respond status code 204 no content', async () => {
                        const deleteExamResponse = await deleteExam(agent, createdModuleId, createdExamId)
                        expect(deleteExamResponse.statusCode).toBe(204)
                    })

                })



            })

            describe('GET /:exam_id', () => {
                describe('given created exam id resource just removed', () => {
                    it('should respond status code 404', async () => {
                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        expect(getExamResponse.statusCode).toBe(404)
                    })
                })
            })
        })






        describe('CREATE MODULE NO EXAMS -> GET MODULES EXAMS -> ADD EXAM TO MODULE -> GET MODULES EXAMS', () => {

            let createdModuleId
            let createdExamId

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'

            // create module first
            beforeAll(async () => {
                createdModuleId = await createModule(agent, createdModuleName)
            })

            afterAll(async () => {
                await deleteModule(agent, createdModuleId)
            })

            describe('GET /', () => {
                describe('given correct module id with no exams', () => {
                    it('should respond status code 200 with empty array', async () => {
                        const examsInModuleResponse = await getModulesExams(agent, createdModuleId)
                        expect(examsInModuleResponse.statusCode).toBe(200)
                        expect(examsInModuleResponse.body).toStrictEqual([])
                    })
                })

                describe('given exam added to module', () => {
                    it('should respond status code 200 with array containing shallow information that exam', async () => {
                        const createNewExamResponse = await createNewExam(agent, createdExamName, createdModuleId)
                        createdExamId = createNewExamResponse.body.exam_id
                        const examsInModuleResponse = await getModulesExams(agent, createdModuleId)
                        expect(examsInModuleResponse.statusCode).toBe(200)
                        const foundExamIdInModule = examsInModuleResponse.body.some((exam) => {
                            return exam.exam_id === createdExamId
                        })
                        expect(foundExamIdInModule).toBe(true)
                    })
                })
            })
        })




        describe('CREATE MODULE WITH EXAM -> ADD SUPER USER -> REMOVE SUPER USER', () => {
            let createdModuleId
            let createdExamId

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'

            const validMarkerId = 2

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


            describe('POST /:exam_id/super_user', () => {
                describe('given valid exam id and valid super user id', () => {
                    it('should respond status code 201', async () => {
                        const addSuperUserToExamResponse = await addSuperUserToExam(agent, createdModuleId, createdExamId, validMarkerId)
                        expect(addSuperUserToExamResponse.statusCode).toBe(201)
                    })
                })
            })


            describe('DELETE /:exam_id/super_user/:super_user_id', () => {
                describe('given valid exam id and valid super user id', () => {
                    it('should respond status code 204', async () => {
                        const removeSuperUserFromExamResponse = await removeSuperUserFromExam(agent, createdModuleId, createdExamId, validMarkerId)
                        expect(removeSuperUserFromExamResponse.statusCode).toBe(204)
                    })
                })
            })
        })


        describe('CREATE MODULE WITH EXAM -> GET EXAM ->  ADD FILE TYPE -> REMOVE FILE TYPE -> GET EXAM', () => {

            let createdModuleId
            let createdExamId

            let createdModuleName = 'test module exam test'
            let createdExamName = 'test exam exam test'


            const validFileTypeId = 1


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


            describe('POST /:exam_id/file_type', () => {
                describe('given valid module_id, valid exam_id, valid file_type_id', () => {
                    it('should respond 201 created', async () => {
                        const addFileTypeToExamResponse = await addFileTypeToExam(agent, createdModuleId, createdExamId, validFileTypeId)
                        expect(addFileTypeToExamResponse.statusCode).toBe(201)
                    })
                })
            })

            describe('GET /:exam_id', () => {
                describe('given file type just added to exam', () => {
                    it('should respond 200 with correct file type addition', async () => {
                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        expect(getExamResponse.statusCode).toBe(200)
                        const fileTypeAdded = getExamResponse.body.fileTypes.some((ft) => {
                            return ft.file_type_id === validFileTypeId && ft.allowed === true
                        })
                        expect(fileTypeAdded).toBe(true)
                    })
                })
            })

            describe('DELETE /:exam_id/file_type/:file_type_id', () => {
                describe('given file_type_id, exam_id, module_id valid', () => {
                    it('should return 204 no content', async () => {
                        const removeFileTypeFromExamResponse = await removeFileTypeFromExam(agent, createdModuleId, createdExamId, validFileTypeId)
                        expect(removeFileTypeFromExamResponse.statusCode).toBe(204)
                    })
                })
            })

            describe('GET /:exam_id', () => {
                describe('given file type just removed from exam', () => {
                    it('should respond 200 with correct file type removal', async () => {
                        const getExamResponse = await getExam(agent, createdModuleId, createdExamId)
                        expect(getExamResponse.statusCode).toBe(200)
                        const fileTypeAdded = getExamResponse.body.fileTypes.some((ft) => {
                            return ft.file_type_id === validFileTypeId && ft.allowed === true
                        })
                        expect(fileTypeAdded).toBe(false)
                    })
                })
            })


        })

        describe('GET /:exam_id/results_csv', () => {
            it('should be tested in student exam submissions', () => {
                expect(true).toBe(true)
            })
        })
    })
})