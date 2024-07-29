


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

function addStudentExamSubmission(studentNumber) {
    cy.get('input[type="text"]').type(studentNumber)
    cy.contains('span', studentNumber)
        .parent()
        .find('button')
        .click()

    for (let i = 0; i < studentNumber.length; i++) {
        cy.get('input[type="text"]').type(`{backspace}`)
    }

    cy.contains('td', studentNumber).should('exist')

}

function accessSES(studentNumber) {
    cy.contains('td', studentNumber).click()
    cy.contains('h5', studentNumber).should('exist')
}


function uploadNewSES(filePath, rootFolderName) {
    cy.contains('button', 'Submission Upload').click()
    cy.get('input[name="file"]')
        .attachFile(filePath)
    cy.contains('button', 'Upload New').click()
    cy.contains('button', 'Display').click()
    cy.contains('button', rootFolderName).should('exist')
    cy.contains('button', 'Close').click()
}

function addMarksAndCritiqueToRubric() {
    cy.contains('button', 'Rubric Marks').click()

    const addedCritique = 'addedCritique'

    const addedNumber = '0.50'

    cy.get('td[id="doubleClickCell-rubric_component_critique-0"]').dblclick()
    cy.get('td[id="doubleClickCell-rubric_component_critique-0"]').find('textarea').type(addedCritique)
    cy.get('td[id="doubleClickCell-rubric_component_critique-0"]').find('textarea').type('{enter}')

    cy.contains('td', addedCritique).should('exist')

    cy.get('td[id="doubleClickCell-rubric_component_mark-0"]').dblclick()
    cy.get('td[id="doubleClickCell-rubric_component_mark-0"]').find('textarea').type(addedNumber)
    cy.get('td[id="doubleClickCell-rubric_component_mark-0"]').find('textarea').type('{enter}')

    cy.contains('td', addedNumber).should('exist')


    cy.get('td[id="doubleClickCell-rubric_component_critique-1"]').dblclick()
    cy.get('td[id="doubleClickCell-rubric_component_critique-1"]').find('textarea').type(addedCritique)
    cy.get('td[id="doubleClickCell-rubric_component_critique-1"]').find('textarea').type('{enter}')

    cy.contains('td', addedCritique).should('exist')

    cy.get('td[id="doubleClickCell-rubric_component_mark-1"]').dblclick()
    cy.get('td[id="doubleClickCell-rubric_component_mark-1"]').find('textarea').type(addedNumber)
    cy.get('td[id="doubleClickCell-rubric_component_mark-1"]').find('textarea').type('{enter}')

    cy.contains('td', addedNumber).should('exist')

}

function markSESForTraining(studentNumber) {
    cy.contains('td', studentNumber).parent().contains('button', 'Mark for training').click()
}

function lockExamInChecklist() {
    cy.get('input[type="checkbox"]').click()
}

function generateAICritique(){
    cy.contains('button', 'Generate AI Critique').click()
    cy.contains('button', 'Rubric Marks').click()
    cy.contains('td', 'This is example feedback for Rubric Component').should('exist')
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
    removeTargetMarker,
    addStudentExamSubmission,
    accessSES,
    uploadNewSES,
    addMarksAndCritiqueToRubric,
    markSESForTraining,
    lockExamInChecklist,
    generateAICritique
}