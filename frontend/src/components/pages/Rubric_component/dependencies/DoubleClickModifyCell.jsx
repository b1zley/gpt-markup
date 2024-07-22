import { useState, useEffect, useRef, useCallback } from "react"
import BASE_API_URL from "../../../../BASE_API_URL"
import axiosToBackend from '../../../../axiosToBackend'

import Form from 'react-bootstrap/Form'
import useConfirmation from "../../../hooks/useConfirmation"

const DoubleClickModifyCell = ({ parameterInCell, rubricComponent, setRubricComponent, index, dataType }) => {




    const [confirm, ConfirmationModal] = useConfirmation()

    let rating_range = rubricComponent.rating_ranges[index]

    const [editPart, setEditPart] = useState(false)
    const [textPart, setTextPart] = useState(rating_range[parameterInCell])





    const handlePutRequest = useCallback(async (paramToUpdate, valueToUpdate) => {
        try {
            const putApiURL = `${BASE_API_URL}module/${rubricComponent.module_id}/exam/${rubricComponent.exam_id}/rubric/${rubricComponent.rubric_component_id}/rating_range/${rating_range.rating_range_id}`
            const putBody = {
                [paramToUpdate]: valueToUpdate
            }
            const responseFromPutRequest = await axiosToBackend.put(putApiURL, putBody)
            if (responseFromPutRequest.status === 200) {
                return true
            } else {
                return false
            }
        } catch (error) {
            // error here
        }


    }, [rubricComponent, rating_range.rating_range_id])


    async function handleDoubleClickPart() {
        setEditPart(true)
    }

    async function handlePartChange(event) {
        setTextPart(event.target.value)
    }



    const handlePartSubmit = useCallback(
        async (parameter) => {

            async function failToUpdate(parameter, reason) {
                setEditPart(false)
                setTextPart(rubricComponent.rating_ranges[index][parameter])
                await confirm(`Failed to update marking range ${reason}`)
            }
            function isValidNumber(input) {
                const regex = /^\d*\.?\d+$/
                return regex.test(input)
            }


            if (dataType === 'decimal' && !isValidNumber(textPart)) {
                //
                return await failToUpdate(parameter, '- decimal values only!')

            }



            if (await handlePutRequest(parameter, textPart)) {
                let updatedRubricComponent = { ...rubricComponent };
                updatedRubricComponent.rating_ranges[index][parameter] = textPart;
                setRubricComponent(updatedRubricComponent);
                setEditPart(false)
            } else {
                await failToUpdate(parameter, '- connection failed')
            }

        }, [confirm, handlePutRequest, rubricComponent, textPart, index, setRubricComponent, dataType]
    )


    async function handlePartKeyDown(event) {
        if (event.key === 'Enter') {

            // specific parameter to use
            handlePartSubmit(parameterInCell)
        }
    }

    const textareaRef = useRef(null); // Ref for the textarea

    useEffect(() => {
        // Function to handle clicks outside of the textarea
        const handleClickOutside = (event) => {
            if (textareaRef.current && !textareaRef.current.contains(event.target)) {
                handlePartSubmit(parameterInCell); // Submit on click outside
            }
        };

        if (editPart) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editPart, parameterInCell, textPart, handlePartSubmit]); // Dependencies to update the effect when these change




    return (
        <td style={{ width: '60%' }}
            onDoubleClick={handleDoubleClickPart}
        >
            <ConfirmationModal />
            {editPart ?

                <Form.Control
                    as="textarea"
                    value={textPart}
                    onChange={handlePartChange}
                    onKeyDown={handlePartKeyDown}
                    ref={textareaRef}
                /> :
                rating_range[parameterInCell]}
        </td>
    )

}


export default DoubleClickModifyCell