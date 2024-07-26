


function createModule() {
    const moduleCreationName = `Test Module - ${Math.random()}`
    cy.get('input[id="createModuleName"]').type(moduleCreationName)
    cy.get('button[id="createModuleButton"]').click()
    cy.contains('a', moduleCreationName)
    return moduleCreationName
}

function navigateToModules() {
    cy.contains('a', 'Modules').click()
    cy.contains('h3', 'Modules')
}

function navigateToSpecificModule(moduleName) {
    cy.contains('a', moduleName).click()
    cy.contains('h3', moduleName).should('be.visible')
}

function deleteModuleByName(moduleToDelete) {
    cy
        .contains('a', moduleToDelete)
        .parent()
        .parent()
        .parent()
        .find('button')
        .click()

    cy.contains('button', 'Confirm').click()

    cy
        .contains('a', moduleToDelete)
        .should('not.exist')
}


export { createModule, navigateToModules, deleteModuleByName, navigateToSpecificModule }