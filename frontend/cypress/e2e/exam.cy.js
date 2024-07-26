import {
    navigateToPanel,
    editEditButtonComponent,
    uploadRtf,
    toggleFileType,
    uploadRubricComponentsAsCSV,
    addNewRc,
    addMarkingRange,
    toggleTempTopP,
    editTemperatureValue,
    uploadExamZip,
    addNewMarker,
    removeTargetMarker
} from "../support/utils/examUtil";
import { loginFunction } from "../support/utils/loginUtil";
import { navigateToModules, createModule, navigateToSpecificModule, deleteModuleByName } from "../support/utils/modulesUtil";
import { addLecturerExample, createExam, createModuleExamNavigateToExam, deleteExam, navigateToExam, removeLecturerFromExam } from "../support/utils/moduleUtil";

describe('Exam', function () {

    before(function () {
        cy.fixture('logins').as('logins');
    })

    let newlyCreatedModule;
    let newlyCreatedExam;
    beforeEach(function () {
        const { validLogin } = this.logins
        const returnObject = createModuleExamNavigateToExam(validLogin)
        newlyCreatedModule = returnObject.newlyCreatedModule
        newlyCreatedExam = returnObject.newlyCreatedExam
    })

    afterEach(function () {
        // tear down
        cy.visit('/module')
        navigateToModules()
        deleteModuleByName(newlyCreatedModule)
    })

    describe('Exam Question', function () {
        describe('given edit clicked, text input, commit clicked', function () {
            it('should correctly update dom with new text', function () {

                navigateToPanel('Exam Question')

                const editText = `This is updated text: ${Math.random()}`
                editEditButtonComponent(editText, 'Exam Question')


            })
        })

        describe('given upload clicked, rtf file uploaded, upload clicked', function () {
            it('should correctly update dom with new text from rtf file', function () {
                navigateToPanel('Exam Question')

                const editFilePath = '../testUploadFiles/testRTF.rtf'
                uploadRtf(editFilePath, 'super mega', 'Exam Question')


            })
        })
    })


    describe('File Types', function () {
        describe('given java file type toggled on', function () {
            it('should correctly update dom with java enabled', function () {
                navigateToPanel('File Types')
                toggleFileType('java', true)
            })
        })

        describe('give java file type toggled on, toggled off', function () {
            it('should correctly update the dom with java disabled', function () {
                navigateToPanel('File Types')
                toggleFileType('java', true)
                toggleFileType('java', false)

            })
        })
    })


    describe('Rubric', function () {
        describe('given upload components as csv clicked, and csv file uploaded', function () {
            it('should correctly update dom with new rubric components', function () {
                navigateToPanel('Rubric')
                const expectedArray = [
                    {
                        name: 'Program Functionality',
                        desc: 'This is the description for program functionality',
                        max: '6.00'
                    },
                    {
                        name: 'ANOTHER COMPONENT',
                        desc: 'This is another component desc',
                        max: '1.00'
                    }
                ]
                const csvPath = '../testUploadFiles/testRubricComponent.csv'
                uploadRubricComponentsAsCSV(csvPath, expectedArray)


            })
        })

        describe('given add component', function () {
            it('should add new RC and redirect to new RC edit page, which should be interactive', function () {
                navigateToPanel('Rubric')

                const newRc = addNewRc()

                addMarkingRange()

            })
        })
    })

    describe('AI Options', function () {
        describe('given edit prompt specifications clicked, text added, commit clicked', function () {
            it('should correctly update dom with new prompt specifications', function () {
                navigateToPanel('AI Options')
                editEditButtonComponent('this is example text', 'AI Options')
            })
        })


        describe('given upload prompt clicked, correct RTF file uploaded', function () {
            it('should correctly update dom with new prompt specifications from RTF file', function () {
                navigateToPanel('AI Options')

                const editFilePath = '../testUploadFiles/testRTF.rtf'
                uploadRtf(editFilePath, 'super mega', 'AI Options')

            })
        })

        describe('given temp top p toggled to top_p', function () {
            it('should correctly update dom with new toggle value', function () {
                navigateToPanel('AI Options')
                toggleTempTopP(true)

            })
        })

        describe('given temp top p toggled to temp', function () {
            it('should correctly update dom with new toggle value', function () {
                navigateToPanel('AI Options')
                toggleTempTopP(true)
                toggleTempTopP(false)

            })
        })

        describe('given temperature value modified', function () {
            it('should correctly update dom with new temperature value', function () {
                navigateToPanel('AI Options')

                editTemperatureValue(0.01)

            })
        })


    })

    describe('Model Answer', function () {
        describe('given attempt to upload valid zip file', function () {
            it('should include display project files button', function () {
                navigateToPanel('Model Answer')

                const zipPath = '../testUploadFiles/EXAM_MODEL_ANSWER-P3 Jan 2024.zip'
                uploadExamZip(zipPath, 'Model Answer')

            })
        })
    })

    describe('Engaged SuperUsers', function () {
        describe('given attempt to add and remove marker', function () {
            it('should correctly update dom with marker, then correctly update dom with marker removal', function () {

                navigateToPanel('Engaged SuperUsers')

                const newMarker = addNewMarker()
                removeTargetMarker(newMarker)
            })
        })
    })

    describe.only('Add Student Submissions', function () {
        describe('given search for student and add', function () {
            it('should correctly update dom with new student submission', function () {
                
            })
        })
    })
})