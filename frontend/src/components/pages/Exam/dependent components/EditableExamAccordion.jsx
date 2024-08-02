import { useState } from 'react'
import axiosToBackend from '../../../../axiosToBackend'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'


import BASE_API_URL from '../../../../BASE_API_URL'
import UploadTextAsRTF from './UploadTextAsRTF'
import useConfirmation from '../../../hooks/useConfirmation'


/**
 * A component that provides an editable accordion panel for displaying and updating a specific field of an exam object.
 * The field can be edited in a text area and committed to the backend, or reverted to its original value.
 * It also includes functionality for uploading RTF files if specified.
 * 
 * @component
 * @example
 * ```jsx
 * <EditableExamAccordion
 *   parentObject={examObject}
 *   setParentObject={setExamObject}
 *   param="exam_description"
 *   lastDisplayed={true}
 *   userFriendlyParam="Exam Description"
 *   putUrl={`${BASE_API_URL}exam/update`}
 *   inputType="text"
 *   textBoxHeight="200px"
 *   uploadFunctionality={true}
 *   description="The description of the exam."
 * />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.parentObject - The object containing the field to be edited.
 * @param {Function} props.setParentObject - Function to update the `parentObject` state in the parent component.
 * @param {string} props.param - The key of the field in `parentObject` that is being edited.
 * @param {boolean} props.lastDisplayed - A flag indicating if this is the last displayed accordion item.
 * @param {string} props.userFriendlyParam - A user-friendly name for the field being edited.
 * @param {string} props.putUrl - The URL to which the PUT request should be sent.
 * @param {string} props.inputType - The type of input expected (e.g., 'text', 'decimal'). Used for validation.
 * @param {string} props.textBoxHeight - The height of the text box for the field being edited.
 * @param {boolean} props.uploadFunctionality - A flag indicating if file upload functionality is enabled.
 * @param {string} props.description - A description for the field being edited.
 * 
 * @returns {React.Element} The rendered accordion component.
 */
const EditableExamAccordion = ({
    parentObject, setParentObject,
    param, lastDisplayed,
    userFriendlyParam, putUrl,
    inputType,
    textBoxHeight,
    uploadFunctionality,
    description
}) => {

    const [editMode, setEditMode] = useState(false)
    const [editText, setEditText] = useState(parentObject[param])

    const { is_locked } = parentObject


    const [confirm, ConfirmationModal] = useConfirmation()


    const handleEditModeClicked = (event) => { setEditMode(!editMode) }
    const handleCommitClicked = async (event, editText) => {
        if (inputType && inputType === 'decimal') {
            const regex = /^[0-9.]+$/;
            if (!regex.test(editText)) {
                await confirm('Please use decimal values only')
                return
            }
        }

        // check for overlaps in rubric
        if(userFriendlyParam === 'Maximum Points'){
            for(let i = 0; i < parentObject.rating_ranges.length; i++){
                const rating_range = parentObject.rating_ranges[i]
                if(Number.parseFloat(editText) < Number.parseFloat(rating_range.rating_max_incl)){
                    return await confirm('Maximum cannot overlap with Marking Range maximum!')
                }

            }
        }

        console.log(param)
        console.log(editText)

        try {
            if (await sendExamPutRequest(param, editText)) {
                setParentObject({ ...parentObject, [param]: editText })
                setEditMode(false)
            } else {
                window.alert('Failed to update')
            }
        } catch (err) {
            await confirm(`Failed to update ${userFriendlyParam}`)
        }
    }

    const handleRevertClicked = (event) => {
        setEditMode(!editMode)
        setEditText(parentObject[param])
    }

    const handleEditTextChange = (event) => { setEditText(event.target.value) }

    async function sendExamPutRequest(param, newParamValue) {
        const apiPutUrl = putUrl
        const putBody = {
            [param]: newParamValue
        }
        const responseFromPutRequest = await (axiosToBackend.put(apiPutUrl, putBody))
        if (responseFromPutRequest.status === 200) {
            return true
        } else return false
    }


    if (editMode) {
        return (
            <Accordion className="my-0 " defaultActiveKey="0">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                    <Accordion.Header>{userFriendlyParam}</Accordion.Header>
                    <Accordion.Body>
                        <div>
                            {description}
                        </div>
                        <hr className='divider' />
                        <div className="d-flex overflow-auto" style={{ height: textBoxHeight ? textBoxHeight : '150px' }}>
                            <InputGroup className="me-1" style={{ width: '100%' }}>
                                <Form.Control
                                    placeholder={userFriendlyParam}
                                    aria-label={userFriendlyParam}
                                    as="textarea"
                                    onChange={handleEditTextChange}
                                    value={editText}
                                >

                                </Form.Control>
                            </InputGroup>

                            <div className='ms-auto d-flex flex-column align-items-between'>
                                <Button variant={'success'} onClick={(e) => { handleCommitClicked(e, editText) }} className='my-1' style={{ height: '38px' }}>Commit</Button>
                                <Button variant={'warning'} onClick={handleRevertClicked} className='my-1 text-white' style={{ height: '38px' }}>Revert</Button>
                            </div>
                        </div>
                        <ConfirmationModal hideClose={true}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion >
        )
    } else {
        return (
            <Accordion className="my-0 " defaultActiveKey="0">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                    <Accordion.Header>{userFriendlyParam}</Accordion.Header>
                    <Accordion.Body>
                        <div>
                            {description}
                        </div>
                        <hr className='divider' />
                        <div className="d-flex overflow-auto" style={{ height: textBoxHeight ? textBoxHeight : '150px' }}>
                            <pre style={{ width: '100%' }}>
                                {parentObject[param] ? parentObject[param] : 'None added...'}
                            </pre>
                            {is_locked ? null :
                                <>
                                    <Button onClick={handleEditModeClicked} className="ms-auto" style={{ height: '38px' }}>Edit</Button>
                                    <UploadTextAsRTF
                                        parentObject={parentObject}
                                        setParentObject={setParentObject}
                                        param={param}
                                        editText={editText}
                                        setEditText={setEditText}
                                        userFriendlyParam={userFriendlyParam}
                                        handleCommitClicked={handleCommitClicked}
                                    />
                                </>
                            }

                        </div>


                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }






}


export default EditableExamAccordion