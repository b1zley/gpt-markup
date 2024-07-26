const { concatenateAnyFiles, listDirectoryStructure } = require("../../controllers/codeMinifier/parseFilesConcatenate")

const fs = require('fs').promises;





describe('Folder Concatenator Suite', () => {

    describe('concatenateAnyFiles(directoryPath, extensions)', () => {
        describe('given directoryPath = java project and extensions = .java', () => {
            const javaProjectDirPath = './tests/__mocks__/exampleJavaProject'
            const onlyJavaExtension = ['.java']

            const expectedStringPath = './tests/__mocks__/exampleJavaProjectOutputConcat.txt'

            it('should return the java project concatenated and minified to a single string', async () => {
                const actualConcatenatedString = await concatenateAnyFiles(javaProjectDirPath, onlyJavaExtension)
                const expectedString = await fs.readFile(expectedStringPath, 'utf8');

                expect(actualConcatenatedString).toBe(expectedString.toString())

            })
        })

        describe('given directoryPath = java + txt + js and extensions = .java + .txt', () => {
            const javaTxtJsProject = './tests/__mocks__/testJavaTxtJs'
            const javaAndTxt = ['.java', '.txt']
            const expectedStringPath = './tests/__mocks__/testJavaTxtJsOutputConcat.txt'
            it('should return the java and txt files concatenated, with java files minified', async () => {
                const actualConcatenatedString = await concatenateAnyFiles(javaTxtJsProject, javaAndTxt)
                const expectedString = await fs.readFile(expectedStringPath, 'utf8');
                expect(actualConcatenatedString).toBe(expectedString.toString())
            })
        })
    })

    describe('listDirectoryStructure(directoryPath)', () => {
        describe('given directory path is exampleJavaProject', () => {
            it('should return correct directory structure', async () => {
                const javaProjectDirPath = './tests/__mocks__/exampleJavaProject'
                const expectedStringPath = './tests/__mocks__/exampleJavaProjectDirStructure.txt'
                const actualConcatenatedString = await listDirectoryStructure(javaProjectDirPath)
                const expectedString = await fs.readFile(expectedStringPath, 'utf8');
                expect(actualConcatenatedString).toBe(expectedString.toString())
            })
        })
    })
})