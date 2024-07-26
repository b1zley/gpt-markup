import { loginFunction } from "../support/utils/loginUtil"
import { createModule, deleteModuleByName, navigateToModules, navigateToSpecificModule } from "../support/utils/modulesUtil"

describe('Modules', function () {

    before(function () {
        cy.fixture('logins').as('logins');

    })
    describe('given user logged in', function () {


        it('should allow user to navigate to modules page', function () {
            const { email, password } = this.logins.validLogin
            loginFunction(email, password)
            navigateToModules()
        })

        it('should allow creation + deletion of new module', function () {
            const {email, password} = this.logins.validLogin
            loginFunction(email, password)
            navigateToModules()
            const newlyCreatedModule = createModule()
            deleteModuleByName(newlyCreatedModule)
        })

        it('should allow creation + navigation to new module page', function () {
            const {email, password} = this.logins.validLogin
            loginFunction(email, password)
            navigateToModules()
            const newlyCreatedModule = createModule()
            navigateToSpecificModule(newlyCreatedModule)
            // tear down module
            navigateToModules()
            deleteModuleByName(newlyCreatedModule)
        })
    })
})