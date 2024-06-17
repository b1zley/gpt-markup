
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from '../../../BASE_API_URL'
import axios from 'axios'

const DoubleClickModifyMarkCell = ({ parameterInCell, examSubmissionInformation, setExamSubmissionInformation, index }) => {

    const [editPart, setEditPart] = useState(false)
    const [textPart, setTextPart] = useState(examSubmissionInformation.rubric[index][parameterInCell])

    async function handleDoubleClickPart() {
        setEditPart(true)
    }

    async function handlePartChange(event) {
        setTextPart(event.target.value)
    }

    async function handlePartSubmit(){
        setEditPart(false)
        if (await handlePutRequest(parameterInCell, textPart)) {
            let updatedExamSubmissionInformation = {...examSubmissionInformation}
            examSubmissionInformation.rubric[index][parameterInCell] = textPart
            setExamSubmissionInformation(updatedExamSubmissionInformation);
        } else {
            window.alert('Failed to update marking range')
        }
    }

    async function handlePartKeyDown(event) {
        if(event.key === 'Enter'){
            handlePartSubmit()
        }
    }

    async function handlePutRequest(){

        const putApiURL = `${BASE_API_URL}module/${examSubmissionInformation.module_id}/exam/${examSubmissionInformation.exam_id}/student_exam_submission/${examSubmissionInformation.student_exam_submission_id}/rubric_component/${examSubmissionInformation.rubric[index].rubric_component_id}`
        console.log('put api url',putApiURL)
        const putBody = {
            [parameterInCell]: textPart
        }

        console.log(putBody)
        console.log(putApiURL)

        const responseFromPut = await axios.put(putApiURL, putBody)
        console.log(responseFromPut)
        return responseFromPut.status === 200
    }

    return (
        <td style={{ width: '60%' }}
            onDoubleClick={handleDoubleClickPart}
        >
            {editPart ?

                <Form.Control
                    as="textarea"
                    value={textPart}
                    onChange={handlePartChange}
                    onKeyDown={handlePartKeyDown}
                /> :
                examSubmissionInformation.rubric[index][parameterInCell] ? examSubmissionInformation.rubric[index][parameterInCell] : 'Double click to add...'}
        </td>
    )

}


export default DoubleClickModifyMarkCell