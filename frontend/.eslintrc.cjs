module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    // Add Cypress environment settings
    'cypress/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    // Add Cypress recommended ruleset
    'plugin:cypress/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: ['react-refresh', 'cypress'], // Add cypress to plugins
  rules: {
    'no-unused-vars': 'warn',
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    // Add any Cypress specific rules or overrides here if needed
  },
}
