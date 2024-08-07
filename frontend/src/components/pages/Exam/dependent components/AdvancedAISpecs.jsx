import { Accordion, Col, Row } from "react-bootstrap"


import Form from 'react-bootstrap/Form'
import { InputGroup } from "react-bootstrap"
import Container from 'react-bootstrap/Container'

import { useState } from 'react'

import CustomNoChangeSwitch from "../../../shared/CustomNoChangeSwitch"
import BASE_API_URL from "../../../../BASE_API_URL"
import axiosToBackend from "../../../../axiosToBackend"
import useConfirmation from "../../../hooks/useConfirmation"


/**
 * A component that allows users to configure advanced AI options such as temperature and top_p values.
 * 
 * This component displays an accordion with options to adjust the temperature and top_p parameters for AI models. It also provides a toggle to switch between temperature and top_p modes.
 * 
 * @component
 * @example
 * ```jsx
 * <AdvancedAISpecs examInformation={examInformation} setExamInformation={setExamInformation} />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.examInformation - An object containing the current AI parameters and exam details.
 * @param {number|null} props.examInformation.temperature - The current temperature setting.
 * @param {number|null} props.examInformation.top_p - The current top_p setting.
 * @param {boolean} props.examInformation.top_p_mode - Indicates if top_p mode is active.
 * @param {number} props.examInformation.module_id - The ID of the module.
 * @param {number} props.examInformation.exam_id - The ID of the exam.
 * @param {Function} props.setExamInformation - Function to update the exam information state.
 * 
 * @returns {React.Element} The rendered accordion component with advanced AI options.
 */
const AdvancedAISpecs = ({ examInformation, setExamInformation }) => {


    let displayedTemperatureValue;
    if (examInformation.temperature === null) {
        displayedTemperatureValue = ''
    } else {
        displayedTemperatureValue = examInformation.temperature
    }

    let displayedTopPValue = examInformation.top_p === null ? '' : examInformation.top_p


    const [confirm, ConfirmationModal] = useConfirmation()

    async function handleToggleTopP() {
        try {
            // handle api request
            const { module_id, exam_id } = examInformation
            const putBody = {
                top_p_mode: !examInformation.top_p_mode
            }
            const putUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}`
            const response = await axiosToBackend.put(putUrl, putBody)


            // and adjust exam information
            const newExamInformation = { ...examInformation }
            newExamInformation.top_p_mode = !newExamInformation.top_p_mode
            setExamInformation(newExamInformation)
        } catch (err) {
            console.log(err)
            await confirm('Failed to toggle temperature/top_p')
            throw new Error('Failed to toggle temperature/top_p')
        }
    }
    async function handleTemperatureChange(e) {
        try {
            // post request
            const { module_id, exam_id } = examInformation
            const putBody = {
                temperature: Number.parseFloat(e.target.value)
            }
            const putUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}`
            const response = await axiosToBackend.put(putUrl, putBody)
            // adjust render
            const newExamInformation = { ...examInformation }
            newExamInformation.temperature = e.target.value
            setExamInformation(response.data)
            console.log(newExamInformation)
        } catch (err) {
            console.log(err)
            await confirm('Failed to update temperature')
        }

    }

    async function handleTopPChange(e) {
        try {
            const { module_id, exam_id } = examInformation
            const putBody = {
                top_p: Number.parseFloat(e.target.value)
            }
            const putUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}`
            const response = await axiosToBackend.put(putUrl, putBody)
            setExamInformation(response.data)
        } catch (err) {
            //
            console.log(err)
            await confirm('Failed to update top_p')
        }
    }


    const activeStyle = {
        backgroundColor: '#24549c',
        color:'white'
    }


    return (
        <>
            <ConfirmationModal />
            <Accordion defaultActiveKey='0'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        Advanced AI Options
                    </Accordion.Header>
                    <Accordion.Body>
                        <h4>
                            Here be dragons! Default values have been selected after careful testing, but users are free to modify these at their own risk.
                        </h4>
                        <div className="my-3">
                            Token selection mode:
                        </div>
                        <Container>
                            <Row className="g-0">
                                <Col xs={5} style={!examInformation.top_p_mode ? activeStyle : null} className="rounded">
                                    <Container>
                                        <Row>
                                            <Col xs={5} >
                                                <Form.Group className="mb-3 py-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="0 - 1"
                                                        value={displayedTemperatureValue}
                                                        onChange={(e) => handleTemperatureChange(e)}
                                                        step='0.0000001'
                                                        disabled={examInformation.top_p_mode}
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col xs={7} >
                                                <div className="my-2 text-end py-2">
                                                    Temperature
                                                </div>
                                            </Col>

                                        </Row>
                                    </Container>


                                </Col>


                                <Col xs={2}>
                                    <div className="d-flex justify-content-center py-2">
                                        <CustomNoChangeSwitch
                                            initial={!!examInformation.top_p_mode}
                                            handleToggle={handleToggleTopP}
                                        />
                                    </div>

                                </Col>

                                <Col xs={5} style={examInformation.top_p_mode ? activeStyle : null} className="rounded ">
                                    <Container >
                                        <Row >
                                            <Col xs={7} >
                                                <div className="my-2 text-start py-2">
                                                    Top_P
                                                </div>
                                            </Col>
                                            <Col xs={5}>
                                                <Form.Group className="mb-3 py-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="0 - 1"
                                                        value={displayedTopPValue}
                                                        onChange={(e) => handleTopPChange(e)}
                                                        disabled={!examInformation.top_p_mode}
                                                        
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Container>

                                </Col>

                            </Row>


                        </Container>


                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>
        </>
    )

}


export default AdvancedAISpecs