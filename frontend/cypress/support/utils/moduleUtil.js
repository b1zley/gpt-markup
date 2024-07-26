import { createModule, navigateToModules, navigateToSpecificModule } from "./modulesUtil"
import { loginFunction } from "./loginUtil"
import { navigateToPanel } from "./examUtil"

function createExam() {
    const examName = `New Exam Name - ${Math.random()}`
    cy.get('input[id="createExamName"]').type(examName)
    cy.get('button[id="createExamButton"]').click()
    cy.contains('a', examName).should('be.visible')
    return examName
}

function deleteExam(examName) {
    cy
        .contains('a', examName)
        .parent()
        .parent()
        .find('button')
        .click()

    cy.contains('button', 'Confirm').click()
    cy.contains('a', examName).should('not.exist');
}

function addLecturerExample() {
    const exampleLecturer = 'Example Lecturer'
    cy
        .get('select[id="lecturerSelect"]')
        .select(exampleLecturer)

    cy
        .get('button[id="addLecturerButton"]')
        .click()

    cy
        .contains('div', exampleLecturer)
        .should('exist')

    return exampleLecturer
}

function removeLecturerFromExam(lecturerName) {
    cy
        .contains('div', lecturerName)
        .parent()
        .find('button')
        .click()

    cy.get('div[id="lecturerList"]').find('div').contains(lecturerName).should('not.exist')
}

function navigateToExam(examName) {
    cy.contains('a', examName).click()
    cy.contains('button', 'Exam Question').should('exist')
    cy.contains('h4', examName).should('exist')
}


function createModuleExamNavigateToExam(validLogin) {
    const { email, password } = validLogin
    loginFunction(email, password)
    navigateToModules()
    const newlyCreatedModule = createModule()
    navigateToSpecificModule(newlyCreatedModule)
    const newlyCreatedExam = createExam()
    navigateToExam(newlyCreatedExam)
    const returnObject = {
        newlyCreatedModule, newlyCreatedExam
    }
    return returnObject
}


function editExamQuestion(text) {
    cy.contains('button', 'Edit').click()
    cy.get('textarea[placeholder="Exam Question"]').type(text)
    cy.contains('button', 'Commit').click()
    cy.reload()
    navigateToPanel('Exam Question')
    cy.contains('pre', text).should('exist')
}


export {
    createExam,
    deleteExam,
    addLecturerExample,
    removeLecturerFromExam,
    navigateToExam,
    createModuleExamNavigateToExam,
    editExamQuestion,
}