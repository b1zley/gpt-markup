
import { useState } from 'react'
import Form from 'react-bootstrap/Form'

const DoubleClickModifyMarkCell = ({ parameterInCell, examSubmissionInformation, setExamSubmissionInformation, index }) => {

    console.log(examSubmissionInformation)

    const [editPart, setEditPart] = useState(false)
    const [textPart, setTextPart] = useState(null)

    async function handleDoubleClickPart() {

    }

    async function handlePartChange() {

    }

    async function handlePartKeyDown() {

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