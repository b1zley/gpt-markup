// const globalTeardown = require("./tests/utils/globalTeardown");

// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    // preset: "ts-jest",
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.js'],
    verbose: true,
    setupFiles: ['dotenv/config'],
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"]
    // forceExit: true,
    // collectCoverage: true,
    // coverageDirectory: 'coverage',
    // coverageReporters: ['text', 'lcov'],

    
    // detectOpenHandles: true,
    // globalTeardown: './tests/utils/globalTeardown'
}