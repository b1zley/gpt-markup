const { countTokens } = require('./tokenCounter/tokenCounter')


const exampleSystemMessageString = `You are a marker for a university level programming exam. The course you are marking for is a Master’s conversion course, teaching students from a variety of backgrounds the skills they need to succeed as a modern software developer. 
The exam you are marking will be delivered to you as an entire java project file, which has been concatenated into a single string, and partially minified to remove whitespace from code blocks.
Please provide feedback and a mark out of 30 for each rubric component in the following JSON format:
[
  {"feedback": "example feedback for Part 1", "mark": 25},
  {"feedback": "example feedback for Part 2", "mark": 28}
]
The module you are marking for is a programming module, and you should judge student’s exam submissions based on the following information:
`


async function handleAiApiCall(informationForLLM) {

    // console.log(informationForLLM)
    // console.log(Object.keys(informationForLLM))

    const { examInformation, submissionText } = informationForLLM

    // console.log(Object.keys(examInformation))

    const examString = examInformationParse(examInformation)

    const systemMessage = exampleSystemMessageString + examString
    // console.log(systemMessage)
    // console.log(countTokens(systemMessage))

    const messages = [{ role: "system", content: systemMessage },
        {role: "user", content: submissionText}
    ]

    console.log(messages)
    
    const response = await openAiApiCall(messages)
    // console.log(response)

}

async function openAiApiCall(messages){

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