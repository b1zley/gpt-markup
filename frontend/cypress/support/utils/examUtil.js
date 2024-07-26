


function navigateToPanel(panelName) {
    cy.contains('button', panelName).click()
    cy.contains('h2', panelName).should("be.visible")
}

export { navigateToPanel }