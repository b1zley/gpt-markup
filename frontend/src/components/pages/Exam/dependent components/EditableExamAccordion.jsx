import { useState } from 'react'
import axiosToBackend from '../../../../axiosToBackend'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'


import BASE_API_URL from '../../../../BASE_API_URL'
import UploadTextAsRTF from './UploadTextAsRTF'

const EditableExamAccordion = ({
    parentObject, setParentObject,
    param, lastDisplayed,
    userFriendlyParam, putUrl,
    inputType,
    textBoxHeight,
    uploadFunctionality
}) => {

    const [editMode, setEditMode] = useState(false)
    const [editText, setEditText] = useState(parentObject[param])

    const handleEditModeClicked = (event) => { setEditMode(!editMode) }
    const handleCommitClicked = async (event, editText) => {
        if (inputType && inputType === 'decimal') {
            const regex = /^[0-9.]+$/;
            if (!regex.test(editText)) {
                window.alert('Decimal values only!')
                return
            }
        }

        console.log(param)
        console.log(editText)

        if (await sendExamPutRequest(param, editText)) {
            setParentObject({ ...parentObject, [param]: editText })
            setEditMode(false)
        } else {
            window.alert('Failed to update')
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
                                <Button variant={'success'} onClick={(e) => {handleCommitClicked(e, editText)}} className='my-1' style={{ height: '38px' }}>Commit</Button>
                                <Button variant={'warning'} onClick={handleRevertClicked} className='my-1 text-white' style={{ height: '38px' }}>Revert</Button>
                            </div>
                        </div>

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


                        <div className="d-flex overflow-auto" style={{ height: textBoxHeight ? textBoxHeight : '150px' }}>
                            <pre style={{ width: '100%' }}>
                                {parentObject[param] ? parentObject[param] : 'None added...'}
                            </pre>
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
                        </div>


                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }






}


export default EditableExamAccordion