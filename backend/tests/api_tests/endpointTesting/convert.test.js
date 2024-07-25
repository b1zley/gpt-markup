const request = require('supertest');
const path = require('path');
const { getAuthenticatedAgent } = require('../..//utils/loggedInUserAgent'); // Adjust path as needed
const { db } = require('../../../routesCommonDependencies'); // Ensure this path is correct
const mockFolderPath = path.join(__dirname, '../../__mocks__/')

const parseRTF = require('rtf-parser');
const fs = require('fs').promises;
const { convertRtfToPlainText } = require('../../utils/convertFunctions')


describe('Convert Suite', () => {

    let agent;

    beforeAll(async () => {
        agent = await getAuthenticatedAgent()
    })

    afterAll(async () => {
        await db.end(); // Ensure the database connection is closed
    });

    const rtfPath = path.join(mockFolderPath, 'testRTF.rtf')


    describe('POST /convert/RtfToPlainText', () => {
        describe('given rtf file uploaded', () => {
            it('should return status code 200 with decoded rtf as string', async () => {
                const convertRtfToPlainTextRes = await convertRtfToPlainText(agent, rtfPath)
                expect(convertRtfToPlainTextRes.statusCode).toBe(200)
                const decodedRtf = convertRtfToPlainTextRes.body.content
                // expected rtf content
                const expectedTextData = await fs.readFile(rtfPath)
                parseRTF.string(expectedTextData, (err, doc) => {
                    let plainTextString = ''
                    const paragraphs = doc.content
                    for (const paragraph of paragraphs) {
                        const spans = paragraph.content
                        for (const span of spans) {
                            plainTextString += span.value
                        }
                        plainTextString += '\n'
                    }
                    // compare
                    expect(decodedRtf).toBe(plainTextString)
                })
            })
        })
    })

})