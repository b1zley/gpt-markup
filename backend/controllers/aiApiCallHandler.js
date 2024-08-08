const { countTokens } = require('./tokenCounter/tokenCounter')

const OpenAI = require('openai')
const openai = new OpenAI();

const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODE = process.env.MODE

const { writeClaudeMessageResponseToCSV, writeMessageResponseToCSV } = require('../parseRecording')

const AI_MODE = "claude"


const exampleSystemMessageString = `The exam you are marking will be delivered to you as an entire code project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.
Please provide feedback and a mark for each rubric component in the following JSON format, only return valid, parseable JSON with escaped newlines, if there is only one rubric component, there should only be one element within the array.:
[
  {"aiFeedbackToParse": "example feedback for Part 1", "aiMarkToParse": 25.5},
  {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28.0}
]
In your marking, you should not penalize overexplanation from the student in comments, as the purpose of the exam is to demonstrate knowledge and ability.
The module you are marking for is a programming module, and you should judge student’s exam submissions based on the following information:

IMPORTANT: When providing feedback, please adhere to the following guidelines to ensure compatibility with CSV formatting:
1. Do not use line breaks or carriage returns within your feedback. Use spaces instead.
2. Avoid using commas (,) in your feedback. Use semicolons (;) or other punctuation if needed.
3. Do not use double quotes (") in your feedback. Use single quotes (') if necessary.
4. Avoid using any special characters that might interfere with CSV parsing, such as |, \, or /.

Your feedback should be concise, clear, and informative while adhering to these formatting guidelines.
`

// 4o adjustments

const TEMPERATURE = 0
const TOP_P = 0.00000000000001
const SEED = 1337
const MODEL = "gpt-3.5-turbo-0125"


const testParameters = { TEMPERATURE, TOP_P, SEED, MODEL }


/**
 * Handles the AI API call based on the selected AI mode.
 * 
 * @param {Object} informationForLLM - Information needed for the LLM to generate feedback and marks.
 * @param {string} student_exam_submission_id - The ID of the student exam submission.
 * @returns {Object} The response object containing AI-generated feedback and marks.
 */
async function handleAiApiCall(informationForLLM, student_exam_submission_id) {
    if (MODE === 'dev') {
        console.log('this is dev mode')

        return await generateAICritiqueMethodStub(informationForLLM, student_exam_submission_id)

    }
    if (AI_MODE === "claude") {
        return await handleApiCallClaude(informationForLLM, student_exam_submission_id)
    }
    const { examInformation, submissionText } = informationForLLM

    const examString = examInformationParseOneRubricComponent(examInformation)
    const systemMessage = exampleSystemMessageString + examString

    const messages = [{ role: "system", content: systemMessage },
    { role: "user", content: submissionText }
    ]
    const response = await openAiApiCall(messages)
    response.testParameters = { ...response.testParameters, ...testParameters }
    writeMessageResponseToCSV(student_exam_submission_id, response)
    return response
}

/**
 * Calls the OpenAI API to generate feedback and marks.
 * 
 * @param {Array} messages - Array of message objects for the API call.
 * @returns {Object} The response object containing AI-generated feedback and marks.
 */
async function openAiApiCall(messages) {
    const completion = await openai.chat.completions.create({
        messages,
        model: MODEL,
        seed: SEED,
        top_p: TOP_P,
        temperature: TEMPERATURE
    });
    return {
        content: JSON.parse(completion.choices[0].message.content), testParameters: {
            system_fingerprint: completion.system_fingerprint
        }
    }
}

/**
 * Parses exam information and returns a string representation.
 * 
 * @param {Object} examInformation - Information about the exam.
 * @returns {string} A string representation of the exam information.
 */
function examInformationParse(examInformation) {
    let examString = ''
    examString += `Exam Name: ${examInformation.exam_name}`
    examString += `Exam Question: ${examInformation.exam_question}`
    examString += `Rubric: ${rubricParse(examInformation.rubric)}`
    examString += `Model Answer: ${examInformation.model_answer}`
    return examString
}

/**
 * Parses exam information for a single rubric component.
 * 
 * @param {Object} examInformation - Information about the exam.
 * @param {number} rubricIndex - Index of the rubric component to parse.
 * @returns {string} A string representation of the exam information for the specified rubric component.
 */
function examInformationParseOneRubricComponent(examInformation, rubricIndex) {
    let examString = ''
    examString += `Exam Name: ${examInformation.exam_name}`
    examString += `Exam Question: ${examInformation.exam_question}`
    examString += `Rubric: ${rubricParseSingleComponent(examInformation.rubric, rubricIndex)}`
    examString += `Model Answer: ${examInformation.model_answer}`
    return examString
}

/**
 * Parses the entire rubric and returns a string representation.
 * 
 * @param {Array} rubric - The rubric array containing all rubric components.
 * @returns {string} A string representation of the rubric.
 */
function rubricParse(rubric) {
    let rCString = ''
    for (let i = 0; i < rubric.length; i++) {
        const rubricComponent = rubric[i]
        rCString += `Rubric Component ${i + 1}.`
        rCString += `Name: ${rubricComponent.name}.`
        rCString += `MaxMarks: ${rubricComponent.maximum}.`
        rCString += `Desc: ${rubricComponent.rubric_component_desc}`
        rCString += `RatingRanges:`
        for (let rangeCounter = 0; rangeCounter < rubricComponent.rating_ranges.length; rangeCounter++) {
            rCString += `Range ${rangeCounter + 1}.`
            rCString += `MinInclusive: ${rubricComponent.rating_ranges[rangeCounter].rating_min_incl}.`
            rCString += `MaxInclusive: ${rubricComponent.rating_ranges[rangeCounter].rating_max_incl}.`
            rCString += `Desc: ${rubricComponent.rating_ranges[rangeCounter].rating_desc}.`
        }
    }
    return rCString
}

/**
 * Parses a single rubric component and returns a string representation.
 * 
 * @param {Array} rubric - The rubric array containing all rubric components.
 * @param {number} i - Index of the rubric component to parse.
 * @returns {string} A string representation of the specified rubric component.
 */
function rubricParseSingleComponent(rubric, i) {
    let rCString = ''

    const rubricComponent = rubric[i]
    rCString += `Rubric Component ${i + 1}.`
    rCString += `Name: ${rubricComponent.name}.`
    rCString += `MaxMarks: ${rubricComponent.maximum}.`
    rCString += `Desc: ${rubricComponent.rubric_component_desc}`
    rCString += `RatingRanges:`
    for (let rangeCounter = 0; rangeCounter < rubricComponent.rating_ranges.length; rangeCounter++) {
        rCString += `Range ${rangeCounter + 1}.`
        rCString += `MinInclusive: ${rubricComponent.rating_ranges[rangeCounter].rating_min_incl}.`
        rCString += `MaxInclusive: ${rubricComponent.rating_ranges[rangeCounter].rating_max_incl}.`
        rCString += `Desc: ${rubricComponent.rating_ranges[rangeCounter].rating_desc}.`
    }
    return rCString
}

/**
 * Handles the API call to Claude for generating feedback and marks.
 * 
 * @param {Object} informationForLLM - Information needed for the LLM to generate feedback and marks.
 * @param {string} student_exam_submission_id - The ID of the student exam submission.
 * @returns {Object} The response object containing AI-generated feedback and marks.
 */
async function handleApiCallClaude(informationForLLM, student_exam_submission_id) {

    const { markedSubmissions } = informationForLLM
    const { examInformation, submissionText } = informationForLLM
    let claudeTemp = examInformation.temperature
    let claude_top_p = examInformation.top_p
    let claude_seed = undefined
    let claude_model = "claude-3-5-sonnet-20240620"

    let responsesContentArray = []

    let claude_fingerprint = ''

    let promises = []

    for (let rubricComponentCounter = 0; rubricComponentCounter < examInformation.rubric.length; rubricComponentCounter++) {

        const examString = examInformationParseOneRubricComponent(examInformation, rubricComponentCounter)
        const systemMessage = exampleSystemMessageString + examString
        const { prompt_specifications, prompt_engineering } = informationForLLM.examInformation
        const dynamicSystemMessage = prompt_specifications + prompt_engineering + examString
        const markedSubmissionMessageArray = createMarkedSubmissionMessageArrayOneRubricComponent(markedSubmissions, rubricComponentCounter)

        let claudeObject = {
            model: claude_model,
            max_tokens: 1000,
            system: dynamicSystemMessage,
            messages: [...markedSubmissionMessageArray, { role: "user", content: submissionText }],
        }
        if (!examInformation.top_p_mode) {
            claudeObject = {
                ...claudeObject,
                temperature: claudeTemp
            }
        } else {
            claudeObject = {
                ...claudeObject,
                top_p: claude_top_p
            }
        }
        console.log(`fetching from claude... ${rubricComponentCounter}`)
        // continue; // comment in for testing to prevent triggering api call
        const aiResponse = anthropic.messages.create(claudeObject)
        promises.push(aiResponse)
    }
    const resolvedPromiseArray = await Promise.all(promises);
    for (let i = 0; i < resolvedPromiseArray.length; i++) {
        const parameterizedAiMessage = JSON.parse(resolvedPromiseArray[i].content[0].text)
        responsesContentArray.push(...parameterizedAiMessage)
        claude_fingerprint = resolvedPromiseArray[i].system_fingerprint
    }

    const claudeTestParameters = {
        TEMPERATURE: claudeTemp,
        TOP_P: claude_top_p,
        system_fingerprint: claude_fingerprint,
        MODEL: claude_model,
        SEED: claude_seed
    }
    let responseObject = {
        content: responsesContentArray,
        testParameters: claudeTestParameters
    }

    writeMessageResponseToCSV(student_exam_submission_id, responseObject)
    return responseObject
}

/**
 * Delays the execution for a specified amount of time.
 * 
 * @param {number} ms - The delay time in milliseconds.
 * @returns {Promise} A promise that resolves after the delay.
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



/**
 * Generates a stub for AI critique and feedback, used for testing.
 * 
 * @param {Object} informationForLLM - Information needed for the LLM to generate feedback and marks.
 * @param {string} student_exam_submission_id - The ID of the student exam submission.
 * @returns {Object} The response object containing dummy AI-generated feedback and marks.
 */
async function generateAICritiqueMethodStub(informationForLLM, student_exam_submission_id) {


    const { markedSubmissions, examInformation, submissionText } = informationForLLM
    await delay(2000)

    let responsesContentArray = []
    for (let rubricComponentCounter = 0; rubricComponentCounter < examInformation.rubric.length; rubricComponentCounter++) {

        const aiMarkToParse = 3
        const aiFeedbackToParse = `This is example feedback for Rubric Component ${rubricComponentCounter + 1} ${Math.random()}`

        const responseObject = { aiMarkToParse, aiFeedbackToParse }
        responsesContentArray.push(responseObject)
    }
    const dummyTestParameters = {
        TEMPERATURE: 'testTemp',
        TOP_P: 'testTOP_P',
        system_fingerprint: 'testFingerprint',
        MODEL: 'testModel',
        SEED: 'testSeed'
    }

    const totalResponseObject = {
        content: responsesContentArray,
        testParameters: dummyTestParameters
    }

    writeMessageResponseToCSV(student_exam_submission_id, totalResponseObject)
    return totalResponseObject

}


/**
 * Creates a message array for marked submissions, containing feedback and marks for all rubric components.
 * 
 * @param {Array} markedSubmissions - Array of marked submissions with feedback and marks.
 * @returns {Array} A message array for use in the API call.
 */
function createMarkedSubmissionMessageArray(markedSubmissions) {

    let markedSubmissionMessageArray = []

    for (const markedSubmission of markedSubmissions) {
        const { submissionText, rubricMarkArray } = markedSubmission
        const aiReadyRubricMarkArray = rubricMarkArray.map((rubricMark) => {
            return {
                "aiFeedbackToParse": rubricMark.critique,
                "aiMarkToParse": rubricMark.mark
            }
        })
        let messageArrayPart = [{
            role: "user",
            content: submissionText,
        },
        {
            role: "assistant",
            content: JSON.stringify(aiReadyRubricMarkArray)
        }]
        markedSubmissionMessageArray = markedSubmissionMessageArray.concat(messageArrayPart)
    }
    return markedSubmissionMessageArray
}

/**
 * Creates a message array for marked submissions, containing feedback and marks for a single rubric component.
 * 
 * @param {Array} markedSubmissions - Array of marked submissions with feedback and marks.
 * @param {number} i - Index of the rubric component to include in the messages.
 * @returns {Array} A message array for use in the API call.
 */
function createMarkedSubmissionMessageArrayOneRubricComponent(markedSubmissions, i) {

    let markedSubmissionMessageArray = []
    for (const markedSubmission of markedSubmissions) {
        const { submissionText, rubricMarkArray } = markedSubmission
        const aiReadyRubricMarkArray = rubricMarkArray.filter((rubricComponent, index) => index === i).map((rubricMark) => {

            return {
                "aiFeedbackToParse": rubricMark.critique,
                "aiMarkToParse": rubricMark.mark
            }
        })
        let messageArrayPart = [{
            role: "user",
            content: submissionText,
        },
        {
            role: "assistant",
            content: JSON.stringify(aiReadyRubricMarkArray)
        }]
        markedSubmissionMessageArray = markedSubmissionMessageArray.concat(messageArrayPart)
    }
    return markedSubmissionMessageArray
}




module.exports = { handleAiApiCall }