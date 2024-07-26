


function navigateToPanel(panelName) {
    cy.contains('button', panelName).click()
    cy.contains('h2', panelName).should("be.visible")
}


function editEditButtonComponent(text, componentName) {
    cy.contains('button', 'Edit').click()
    cy.get('textarea').type(text)
    cy.contains('button', 'Commit').click()
    cy.reload()
    if (componentName) {
        navigateToPanel(`${componentName}`)
    }
    cy.contains('pre', text).should('exist')
}

function uploadRtf(filePath, fileText, panel) {
    cy.contains('button', 'Upload').click()
    cy.get('input[name="file"]')
        .attachFile(filePath)

    cy.contains('button', 'Upload New').click()
    cy.contains('button', 'Close').click()

    cy.reload()
    navigateToPanel(`${panel}`)
    cy.contains('pre', fileText).should('exist')
}

function uploadExamZip(filePath, panel) {
    cy.get('input[name="file"]')
        .attachFile(filePath)
    cy.contains('button', 'Upload New').click()
    cy.contains('button', 'Display').should('exist').click()
    cy.contains('button', 'P3OHaganJoshua40100099').should('exist')
    cy.contains('button', 'Close').click()
}

function toggleFileType(fileType, checkedAtEnd) {
    cy.contains('label', fileType)
        .parent()
        .find('input')
        .click()

    cy.reload()

    navigateToPanel('File Types')
    cy.contains('label', fileType)
        .parent()
        .find('input')
        .should(checkedAtEnd ? 'be.checked' : 'not.be.checked')
}


function uploadRubricComponentsAsCSV(filePath, expectedArray) {
    cy.contains('button', 'Upload Components as CSV').click()

    cy.get('input[name="file"]')
        .attachFile(filePath)
    cy.contains('button', 'Upload New').click()
    cy.contains('button', 'Close').click()

    // validate
    expectedArray.forEach((expectedRC) => {
        cy.contains('h6', expectedRC.name)
        cy.contains('p', expectedRC.desc)
        cy.contains('td', expectedRC.max)
    })
}

function addNewRc() {
    const newRCName = `New RC - ${Math.random()}`
    cy.get('input[placeholder="Rubric Component Name"]').type(newRCName)
    cy.contains('button', 'Add Component').click()

    // verify redirect
    cy.contains('h5', newRCName).should('be.visible')
    return newRCName
}

function addMarkingRange() {
    cy.contains('button', 'Add new marking range').click()

    const rangeDesc = Math.random()
    const minIncl = Math.random()
    const maxIncl = Math.random()

    cy.get('textarea[placeholder="Input range description here"]').type(`${rangeDesc}`)
    cy.contains('label', 'Minimum Inclusive').parent().find('input').type(`${minIncl}`)
    cy.contains('label', 'Maximum Inclusive').parent().find('input').type(`${maxIncl}`)
    cy.contains('button', 'Submit').click()


    // validate
    cy.contains('td', rangeDesc).should('be.visible')
    cy.contains('td', minIncl).should('be.visible')
    cy.contains('td', maxIncl).should('be.visible')
}

function toggleTempTopP(checkedAtEnd) {
    cy.get('input[id="custom-switch"]').click()
    cy.reload()
    navigateToPanel('AI Options')
    cy
        .get('input[id="custom-switch"]')
        .should(checkedAtEnd ? 'be.checked' : 'not.be.checked')
}

function editTemperatureValue(target) {
    cy.contains('div', 'Temperature')
        .parent()
        .parent()
        .find('input')
        .type(target)

    cy.contains('div', 'Temperature')
        .parent()
        .parent()
        .find('input', target)
        .should('be.visible')

}


function addNewMarker() {
    const markerName = 'bobby'
    const markerValue = '{"super_user_id":16,"super_user_name":"bobby ","super_user_type_id":2,"super_user_type_name":"Marker","access_rights":"MARKING"}'; // Update this to the corresponding value

    cy.get('select[id="assignMarkerSelect"]').select(markerValue)
    cy.get('button[id="assignMarkerButton"]').click()
    cy.get('div.list-group').contains(markerName).should('exist')
    return markerName
}

function removeTargetMarker(markerName) {
    cy
        .get('div.list-group')
        .contains(markerName)
        .parent()
        .find('button')
        .click()

    cy.get('div.list-group').contains(markerName).should('not.exist')
}




export {
    navigateToPanel,
    editEditButtonComponent,
    uploadRtf,
    toggleFileType,
    uploadRubricComponentsAsCSV,
    addNewRc,
    addMarkingRange,
    toggleTempTopP,
    editTemperatureValue,
    uploadExamZip,
    addNewMarker,
    removeTargetMarker
}