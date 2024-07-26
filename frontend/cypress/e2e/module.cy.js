
import { loginFunction } from "../support/utils/loginUtil";
import { navigateToModules, createModule, navigateToSpecificModule, deleteModuleByName } from "../support/utils/modulesUtil";

describe('Modules', function () {

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

            

            // tear down module
            navigateToModules()
            deleteModuleByName(newlyCreatedModule)


        })

        it('should allow assignment of lecturer and removal of lecturer', function () {

        })

        it('should allow navigation to specific exam', function () {

        })

    })
})