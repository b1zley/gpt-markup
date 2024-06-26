const { countTokens } = require('./tokenCounter/tokenCounter')

const OpenAI = require('openai')
const openai = new OpenAI();

const exampleSystemMessageString = `You are a marker for a university level programming exam. The course you are marking for is a Master’s conversion course, teaching students from a variety of backgrounds the skills they need to succeed as a modern software developer. 
The exam you are marking will be delivered to you as an entire java project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.
Please provide feedback and a mark for each rubric component in the following JSON format:
[
  {"aiFeedbackToParse": "example feedback for Part 1", "aiMarkToParse": 25},
  {"aiFeedbackToParse": "example feedback for Part 2", "aiMarkToParse": 28}
]
In your marking, you should not penalize overexplanation from the student in comments, as the purpose of the exam is to demonstrate knowledge and ability.
The module you are marking for is a programming module, and you should judge student’s exam submissions based on the following information:
`

const TEMPERATURE = 0
const TOP_P = 0.00000000000001
const SEED = 1337
const MODEL = "gpt-3.5-turbo-0125"


const testParameters = {TEMPERATURE, TOP_P, SEED, MODEL}

async function handleAiApiCall(informationForLLM) {

    const { examInformation, submissionText } = informationForLLM

    const examString = examInformationParse(examInformation)
    const systemMessage = exampleSystemMessageString + examString

    const messages = [{ role: "system", content: systemMessage },
        {role: "user", content: submissionText}
    ]
    const response = await openAiApiCall(messages)
    console.log(submissionText)

    // going to attach my parameters to response for ease of recording
    response.testParameters = testParameters
    return response
    
}

async function openAiApiCall(messages){
    // console.log(messages)
    const completion = await openai.chat.completions.create({
        messages,
        model: MODEL,
        seed: SEED,
        top_p: TOP_P,
        temperature: TEMPERATURE
      });
    
      const response = completion.choices[0]
    //   console.log(JSON.parse(response.message.content))
    return completion
    //   return JSON.parse(response.message.content)
}

function examInformationParse(examInformation) {
    let examString = ''
    examString += `Exam Name: ${examInformation.exam_name}`
    examString += `Exam Question: ${examInformation.exam_question}`
    examString += `Rubric: ${rubricParse(examInformation.rubric)}`
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


module.exports = { handleAiApiCall }