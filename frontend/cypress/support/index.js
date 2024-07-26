// Create the file if it doesn't exist

// cypress/support/index.js

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log('Uncaught exception detected:', err.message);
    // Returning false here prevents Cypress from failing the test
    return false;
});