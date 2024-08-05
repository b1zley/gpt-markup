
import { useState, useRef, useEffect, useCallback } from 'react'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'
import useConfirmation from '../../hooks/useConfirmation'
import isValidNumber from '../../../helperFunctions'

/**
 * `DoubleClickModifyMarkCell` is a component that renders a table cell which can be double-clicked to enable editing.
 * It allows users to update specific properties of a rubric component and validates the input for decimal values.
 * The updated values are sent to the backend API and reflected in the component's state.
 *
 * @component
 * @param {string} parameterInCell - The property name to be edited in the rubric component (e.g., 'rubric_component_mark').
 * @param {Object} examSubmissionInformation - The information about the exam submission including rubric details.
 * @param {Function} setExamSubmissionInformation - Function to update the exam submission information in state.
 * @param {number} index - The index of the rubric component in the rubric array to be edited.
 * @returns {JSX.Element} The `DoubleClickModifyMarkCell` component.
 *
 * @example
 * <DoubleClickModifyMarkCell
 *   parameterInCell={'rubric_component_mark'}
 *   examSubmissionInformation={examInfo}
 *   setExamSubmissionInformation={setExamInfo}
 *   index={0}
 * />
 */
const DoubleClickModifyMarkCell = ({ parameterInCell, examSubmissionInformation, setExamSubmissionInformation, index }) => {

    const [editPart, setEditPart] = useState(false)
    const [textPart, setTextPart] = useState(examSubmissionInformation.rubric[index][parameterInCell] ? examSubmissionInformation.rubric[index][parameterInCell] : '')

    const [confirm, ConfirmationModal] = useConfirmation()

    const textareaRef = useRef(null); // Ref for the textarea

    async function handleDoubleClickPart() {
        setEditPart(true)
    }

    async function handlePartChange(event) {
        setTextPart(event.target.value)
    }

    const handlePutRequest = useCallback( async () => {
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

    }, [examSubmissionInformation.exam_id, examSubmissionInformation.module_id, examSubmissionInformation.rubric, examSubmissionInformation.student_exam_submission_id, index, parameterInCell, textPart])



    const handlePartSubmit = useCallback( async () => {
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


    }, [parameterInCell, confirm, examSubmissionInformation, handlePutRequest, index, setExamSubmissionInformation, textPart])

    async function handlePartKeyDown(event) {
        if (event.key === 'Enter') {
            handlePartSubmit()
        }
    }


    
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
            id={`doubleClickCell-${parameterInCell}-${index}`}
        >
            {editPart ?

                <Form.Control
                    as="textarea"
                    value={textPart}
                    onChange={handlePartChange}
                    onKeyDown={handlePartKeyDown}
                    ref={textareaRef}
                /> :
                examSubmissionInformation.rubric[index][parameterInCell] ? examSubmissionInformation.rubric[index][parameterInCell] : 'Double click to add...'}
            <ConfirmationModal />
        </td>
    )

}


export default DoubleClickModifyMarkCell