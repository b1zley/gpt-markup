
import { loginFunction } from "../support/utils/loginUtil";
import { navigateToModules, createModule, navigateToSpecificModule, deleteModuleByName } from "../support/utils/modulesUtil";
import { addLecturerExample, createExam, deleteExam, navigateToExam, removeLecturerFromExam } from "../support/utils/moduleUtil";

describe('Module', function () {

    before(function () {
        cy.fixture('logins').as('logins');
    })

    describe('given user logged in and module created', function () {

        it('should allow creation + deletion of new exam', function () {
            const {email, password} = this.logins.validLogin
            loginFunction(email, password)
            navigateToModules()
            const newlyCreatedModule = createModule()
            navigateToSpecificModule(newlyCreatedModule)
            
            const newlyCreatedExam  = createExam()
            deleteExam(newlyCreatedExam)
            // tear down module
            navigateToModules()
            deleteModuleByName(newlyCreatedModule)
        })

        it('should allow assignment of lecturer and removal of lecturer', function () {
            const {email, password} = this.logins.validLogin
            loginFunction(email, password)
            navigateToModules()
            const newlyCreatedModule = createModule()
            navigateToSpecificModule(newlyCreatedModule)
            const newlyCreatedExam  = createExam()

            const newlyAddedLecturer = addLecturerExample()
            removeLecturerFromExam(newlyAddedLecturer)
            // tear down module and exam
            deleteExam(newlyCreatedExam)
            navigateToModules()
            deleteModuleByName(newlyCreatedModule)
        })

        it.only('should allow navigation to specific exam', function () {
            const {email, password} = this.logins.validLogin
            loginFunction(email, password)
            navigateToModules()
            const newlyCreatedModule = createModule()
            navigateToSpecificModule(newlyCreatedModule)
            const newlyCreatedExam  = createExam()

            navigateToExam(newlyCreatedExam)

            // teardown module
            navigateToModules()
            deleteModuleByName(newlyCreatedModule)
        })

    })
})