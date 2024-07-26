import { loginFunction, logoutFunction } from "../support/utils/loginUtil";
describe('login', () => {
    before(function () {
        // Load fixture data and store it as an alias
        cy.fixture('logins').as('logins');
    });

    describe('clicking login account from navbar', () => {
        it('should redirect to login page', () => {
            cy.visit('/');
            cy.contains('a', 'Account').click();
            cy.contains('a', 'Login').click();
            cy.url().should('include', '/login');
        });
    });

    describe('given valid login details', function () { // Use function() to access `this`
        it('should cause login', function () {

            const { email, password } = this.logins.validLogin
            loginFunction(email, password)

            // Add assertions to verify login success
            cy.contains('a', 'Account').click();
            cy.contains('a', 'Logout').should('be.visible');
        });
    });

    describe('given login successful', function () {
        it('should allow logout', function () {
            const { email, password } = this.logins.validLogin
            loginFunction(email, password)
            logoutFunction()

            // assertions
            cy.get('input[placeholder="Enter email"][id="loginEmail"]').should('be.visible');
            cy.get('input[placeholder="Password"][id="loginPassword"]').should('be.visible');
        })
    })

});


