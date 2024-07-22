
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'
import useConfirmation from '../../hooks/useConfirmation'
import isValidNumber from '../../../helperFunctions'


const DoubleClickModifyMarkCell = ({ parameterInCell, examSubmissionInformation, setExamSubmissionInformation, index }) => {

    const [editPart, setEditPart] = useState(false)
    const [textPart, setTextPart] = useState(examSubmissionInformation.rubric[index][parameterInCell] ? examSubmissionInformation.rubric[index][parameterInCell] : '')

    const [confirm, ConfirmationModal] = useConfirmation()
    async function handleDoubleClickPart() {
        setEditPart(true)
    }

    async function handlePartChange(event) {
        setTextPart(event.target.value)
    }

    async function handlePartSubmit() {
        try {
            console.log('parameterInCell:', parameterInCell)

            if (parameterInCell === 'rubric_component_mark') {
                if (!isValidNumber(textPart)) {
                    // handle bad input
                    return await confirm('Decimal values only!')
                }
                if (textPart.includes('.') && textPart.split('.')[1].length > 2) {
                    // handle decimal places
                    return await confirm('2 Decimal Places maximum!')
                }
            }


            setEditPart(false)
            if (await handlePutRequest(parameterInCell, textPart)) {
                let updatedExamSubmissionInformation = { ...examSubmissionInformation }
                examSubmissionInformation.rubric[index][parameterInCell] = textPart
                setExamSubmissionInformation(updatedExamSubmissionInformation);
            }
        } catch (error) {
            console.log(error)
            await confirm('Failed to update marking range')
            setTextPart(examSubmissionInformation.rubric[index][parameterInCell])
        }
    }

    async function handlePartKeyDown(event) {
        if (event.key === 'Enter') {
            handlePartSubmit()
        }
    }

    async function handlePutRequest() {

        const putApiURL = `${BASE_API_URL}module/${examSubmissionInformation.module_id}/exam/${examSubmissionInformation.exam_id}/student_exam_submission/${examSubmissionInformation.student_exam_submission_id}/rubric_component/${examSubmissionInformation.rubric[index].rubric_component_id}`
        console.log('put api url', putApiURL)
        const putBody = {
            [parameterInCell]: textPart
        }

        console.log(putBody)
        console.log(putApiURL)

        const responseFromPut = await axiosToBackend.put(putApiURL, putBody)
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
            <ConfirmationModal />
        </td>
    )

}


export default DoubleClickModifyMarkCell