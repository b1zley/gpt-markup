import { loginFunction } from "../support/utils/loginUtil"
import { createModule } from "../support/utils/modulesUtil"

describe('Modules', function () {

    before(function () {
        cy.fixture('logins').as('logins');

    })
    describe('given user logged in', function () {


        it('should allow user to navigate to module page', function () {
            const { email, password } = this.logins.validLogin
            loginFunction(email, password)
            
            cy.contains('a', 'Modules').click()
            cy.contains('h3', 'Modules')
        })

        // it('should allow creation of new module', function () {
        //     cy.visit('/module')
        //     createModule()
        // })
    })
})