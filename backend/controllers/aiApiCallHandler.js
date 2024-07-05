const { countTokens } = require('./tokenCounter/tokenCounter')

const OpenAI = require('openai')
const openai = new OpenAI();

const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const { writeClaudeMessageResponseToCSV, writeMessageResponseToCSV } = require('../parseRecording')

const AI_MODE = "claude"


const exampleSystemMessageString = `You are a marker for a university level programming exam. The course you are marking for is a Master’s conversion course, teaching students from a variety of backgrounds the skills they need to succeed as a modern software developer. 
The exam you are marking will be delivered to you as an entire java project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.
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
// please do not include any demarcation at the start or end of your JSON repsonse


const TEMPERATURE = 0
const TOP_P = 0.00000000000001
const SEED = 1337
const MODEL = "gpt-3.5-turbo-0125"


const testParameters = { TEMPERATURE, TOP_P, SEED, MODEL }

async function handleAiApiCall(informationForLLM, student_exam_submission_id) {

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
    // console.log(submissionText)

    // going to attach my parameters to response for ease of recording
    response.testParameters = { ...response.testParameters, ...testParameters }


    writeMessageResponseToCSV(student_exam_submission_id, response)
    return response



}

async function openAiApiCall(messages) {
    // console.log(messages)
    const completion = await openai.chat.completions.create({
        messages,
        model: MODEL,
        seed: SEED,
        top_p: TOP_P,
        temperature: TEMPERATURE
    });
    // console.log('this is a completion')
    // console.log(completion.system_fingerprint)
    // console.log(completion.choices[0].message.content)
    return {
        content: JSON.parse(completion.choices[0].message.content), testParameters: {
            system_fingerprint: completion.system_fingerprint
        }
    }
}

function examInformationParse(examInformation) {
    let examString = ''
    examString += `Exam Name: ${examInformation.exam_name}`
    examString += `Exam Question: ${examInformation.exam_question}`
    examString += `Rubric: ${rubricParse(examInformation.rubric)}`
    examString += `Model Answer: ${examInformation.model_answer}`
    return examString
}

function examInformationParseOneRubricComponent(examInformation, rubricIndex) {
    let examString = ''
    examString += `Exam Name: ${examInformation.exam_name}`
    examString += `Exam Question: ${examInformation.exam_question}`
    examString += `Rubric: ${rubricParseSingleComponent(examInformation.rubric, rubricIndex)}`
    examString += `Model Answer: ${examInformation.model_answer}`
    return examString
}


function rubricParse(rubric) {
    let rCString = ''
    for (let i = 0; i < rubric.length; i++) {
        const rubricComponent = rubric[i]
        // in loop
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


function rubricParseSingleComponent(rubric, i) {
    let rCString = ''

    const rubricComponent = rubric[i]
    // in loop
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


async function handleApiCallClaude(informationForLLM, student_exam_submission_id) {
    // eliminate api call for testing!

    // console.log(informationForLLM.markedSubmissions)

    const { markedSubmissions } = informationForLLM



    // console.log(markedSubmissionMessageArray)

    const { examInformation, submissionText } = informationForLLM

    console.log(examInformation.rubric.length)



    // console.log(submissionText)

    let claudeTemp = 0.0
    let claude_top_p = undefined
    let claude_seed = undefined
    let claude_model = "claude-3-5-sonnet-20240620"

    let responsesContentArray = []

    let claude_fingerprint = ''
    for (let rubricComponentCounter = 0; rubricComponentCounter < examInformation.rubric.length; rubricComponentCounter++) {

        const examString = examInformationParseOneRubricComponent(examInformation, rubricComponentCounter)
        const systemMessage = exampleSystemMessageString + examString

        const markedSubmissionMessageArray = createMarkedSubmissionMessageArrayOneRubricComponent(markedSubmissions, rubricComponentCounter)

        let claudeObject = {
            model: claude_model,
            max_tokens: 1000,
            system: systemMessage,
            messages: [...markedSubmissionMessageArray, { role: "user", content: submissionText }],
            temperature: claudeTemp
        }

        console.log(`fetching from claude... ${rubricComponentCounter}`)
        // console.log(claudeObject.messages[2])
        // continue
        // return
        // throw new Error('STOP')
        const aiResponse = await anthropic.messages.create(claudeObject)

        const parameterizedAiMessage = JSON.parse(aiResponse.content[0].text)
        responsesContentArray.push(...parameterizedAiMessage)
        claude_fingerprint = aiResponse.system_fingerprint
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




function createMarkedSubmissionMessageArray(markedSubmissions) {
    // console.log(markedSubmissions)

    let markedSubmissionMessageArray = []

    // {"user": submissionText, "assistant": "{aiMarkToParse: 1, aiCritiqueToParse: 'wasdwasd'}"}

    for (const markedSubmission of markedSubmissions) {
        const { submissionText, rubricMarkArray } = markedSubmission
        const aiReadyRubricMarkArray = rubricMarkArray.map((rubricMark) => {
            // {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28.0}
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

    // console.log(markedSubmissionMessageArray)
    return markedSubmissionMessageArray
}

/**
 * one rubric component
 * @param {} markedSubmissions 
 * @param {*} i 
 * @returns 
 */
function createMarkedSubmissionMessageArrayOneRubricComponent(markedSubmissions, i) {
    // console.log(markedSubmissions)

    let markedSubmissionMessageArray = []

    // {"user": submissionText, "assistant": "{aiMarkToParse: 1, aiCritiqueToParse: 'wasdwasd'}"}

    for (const markedSubmission of markedSubmissions) {
        const { submissionText, rubricMarkArray } = markedSubmission
        const aiReadyRubricMarkArray = rubricMarkArray.filter((rubricComponent, index) => index === i).map((rubricMark) => {
            // {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28.0}
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

    // console.log(markedSubmissionMessageArray)
    return markedSubmissionMessageArray
}




module.exports = { handleAiApiCall }