function loginFunction(email, password) {
    cy.visit('/login');
    // Access fixture data using `this`
    cy.get('input[placeholder="Enter email"][id="loginEmail"]').type(email);
    cy.get('input[placeholder="Password"][id="loginPassword"]').type(password);
    cy.get('button[id="loginSubmitButton"]').click()

    cy.contains('a', 'Account').click();
    cy.contains('a', 'Logout').should('be.visible');

}


function logoutFunction() {
    cy.contains('a', 'Account').click();
    cy.contains('a', 'Logout').click()
}

export { loginFunction, logoutFunction }