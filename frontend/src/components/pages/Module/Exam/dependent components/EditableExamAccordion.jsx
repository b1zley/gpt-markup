import { useState } from 'react'
import axios from 'axios'


import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'


import BASE_API_URL from '../../../../../BASE_API_URL'

const EditableExamAccordion = ({
    examInformation, setExamInformation,
    examParam, lastDisplayed,
    userFriendlyExamParam
}) => {

    const [editMode, setEditMode] = useState(false)
    const [editText, setEditText] = useState(examInformation[examParam])

    const handleEditModeClicked = (event) => { setEditMode(!editMode) }
    const handleCommitClicked = async (event) => {
        if (await sendExamPutRequest(examParam, editText)) {
            setExamInformation({ ...examInformation, [examParam]: editText })
            setEditMode(!editMode)
        } else {
            window.alert('Failed to update')
        }
    }

    const handleRevertClicked = (event) => {
        setEditMode(!editMode)
        setEditText(examInformation[examParam])
    }

    const handleEditTextChange = (event) => { setEditText(event.target.value) }

    async function sendExamPutRequest(param, newParamValue) {
        const apiPutUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}`
        const putBody = {
            [param]: newParamValue
        }
        const responseFromPutRequest = await (axios.put(apiPutUrl, putBody))
        if (responseFromPutRequest.status === 200) {
            return true
        } else return false
    }


    if (editMode) {
        return (
            <Accordion className="my-0 ">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                    <Accordion.Header>{userFriendlyExamParam}</Accordion.Header>
                    <Accordion.Body>

                        <div className="d-flex">
                            <InputGroup className="me-1">
                                <Form.Control
                                    placeholder={userFriendlyExamParam}
                                    aria-label={userFriendlyExamParam}
                                    as="textarea"
                                    onChange={handleEditTextChange}
                                    value={editText}
                                >
                                    
                                </Form.Control>
                            </InputGroup>

                            <div className='ms-auto d-flex flex-column align-items-between'>
                                <Button variant={'success'} onClick={handleCommitClicked} className='my-1' style={{ height: '38px' }}>Commit</Button>
                                <Button variant={'warning'} onClick={handleRevertClicked} className='my-1 text-white' style={{ height: '38px' }}>Revert</Button>
                            </div>
                        </div>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    } else {
        return (
            <Accordion className="my-0 ">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                    <Accordion.Header>{userFriendlyExamParam}</Accordion.Header>
                    <Accordion.Body>

                        <div className="d-flex">
                            <div>
                                {examInformation[examParam] ? examInformation[examParam] : 'None added...'}
                            </div>
                            <Button onClick={handleEditModeClicked} className="ms-auto" style={{ height: '38px' }}>Edit</Button>

                        </div>


                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }






}


export default EditableExamAccordion