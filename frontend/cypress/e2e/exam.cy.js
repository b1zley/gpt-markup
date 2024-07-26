import { navigateToPanel } from "../support/utils/examUtil";
import { loginFunction } from "../support/utils/loginUtil";
import { navigateToModules, createModule, navigateToSpecificModule, deleteModuleByName } from "../support/utils/modulesUtil";
import { addLecturerExample, createExam, createModuleExamNavigateToExam, deleteExam, editExamQuestion, navigateToExam, removeLecturerFromExam } from "../support/utils/moduleUtil";

describe('Exam', function () {

    before(function () {
        cy.fixture('logins').as('logins');
    })

    describe('Exam Question', function () {
        describe('given edit clicked, text input, commit clicked', function () {
            it('should correctly update dom with new text', function () {

                // get to exam question
                const { validLogin } = this.logins
                const { newlyCreatedModule, newlyCreatedExam } = createModuleExamNavigateToExam(validLogin)
                navigateToPanel('Exam Question')

                const editText = `This is updated text: ${Math.random()}`
                editExamQuestion(editText)

                // tear down
                navigateToModules()
                deleteModuleByName(newlyCreatedModule)
            })
        })

        describe('given upload clicked, rtf file uploaded, upload clicked', function(){
            it('should correctly update dom with new text from rtf file', function (){

            })
        })
    })

})