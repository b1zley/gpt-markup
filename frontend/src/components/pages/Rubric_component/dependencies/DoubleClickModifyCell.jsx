import { useState } from "react"
import BASE_API_URL from "../../../../BASE_API_URL"
import axios from 'axios'
import Form from 'react-bootstrap/Form'

const DoubleClickModifyCell = ({ parameterInCell, rubricComponent, setRubricComponent, index }) => {

    let rating_range = rubricComponent.rating_ranges[index]

    const [editPart, setEditPart] = useState(false)
    const [textPart, setTextPart] = useState(rating_range[parameterInCell])

    async function handlePutRequest(paramToUpdate, valueToUpdate) {
        const putApiURL = `${BASE_API_URL}module/${rubricComponent.module_id}/exam/${rubricComponent.exam_id}/rubric/${rubricComponent.rubric_component_id}/rating_range/${rating_range.rating_range_id}`
        const putBody = {
            [paramToUpdate]: valueToUpdate
        }
        const responseFromPutRequest = await axios.put(putApiURL, putBody)
        if (responseFromPutRequest.status === 200) {
            return true
        } else {
            return false
        }
    }

    async function handleDoubleClickPart() {
        setEditPart(true)
    }

    async function handlePartChange(event) {
        setTextPart(event.target.value)
    }

    async function handlePartSubmit(parameter) {
        setEditPart(false)
        if (await handlePutRequest(parameter, textPart)) {
            let updatedRubricComponent = { ...rubricComponent };
            updatedRubricComponent.rating_ranges[index][parameter] = textPart;
            setRubricComponent(updatedRubricComponent);
        } else {
            window.alert('Failed to update marking range')
        }


    }

    async function handlePartKeyDown(event) {
        if (event.key === 'Enter') {

            // specific parameter to use
            handlePartSubmit(parameterInCell)
        }
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
                rating_range[parameterInCell]}
        </td>
    )

}


export default DoubleClickModifyCell