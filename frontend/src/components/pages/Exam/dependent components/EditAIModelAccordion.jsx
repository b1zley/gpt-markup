import Accordion from "react-bootstrap/Accordion"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'

import { useEffect, useState } from 'react'
import BASE_API_URL from "../../../../BASE_API_URL"
import axiosToBackend from '../../../../axiosToBackend'



/**
 * A component that displays an accordion panel for managing the AI model associated with an exam.
 * It includes functionality to select an AI model from a dropdown menu and update the selected model for the exam.
 * 
 * @component
 * @example
 * ```jsx
 * <EditAiModelAccordion setExamInformation={setExamInformation} examInformation={examInformation} />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.setExamInformation - Function to update the exam information state in the parent component.
 * @param {Object} props.examInformation - Contains information about the exam, including module ID, exam ID, and currently selected AI model name.
 * 
 * @returns {React.Element} The rendered accordion component.
 */
const EditAiModelAccordion = ({ setExamInformation, examInformation }) => {

    const [aiModelsToChoose, setAiModelsToChoose] = useState([])
    const [selectedAiModel, setSelectedAiModel] = useState(null)

    useEffect(() => {
        async function handleFetch() {
            // fetch ai model information from api
            const apiAiModelsURL = `${BASE_API_URL}ai_model`
            const responseFromModelsGet = await axiosToBackend.get(apiAiModelsURL)
            const aiModelsArray = responseFromModelsGet.data
            setAiModelsToChoose(aiModelsArray)
        }
        handleFetch()
    }, [])


    async function handleSelect(eventKey) {
        setSelectedAiModel(aiModelsToChoose[eventKey])
    }

    async function handleModelUpdate(event) {
        event.preventDefault()

        // update model in api
        const putUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}`
        const putBody = {
            chosen_ai_model_id: selectedAiModel.trained_model_id
        }
        const responseFromPutRequest = await axiosToBackend.put(putUrl, putBody)
        // update render based on response

        if (responseFromPutRequest.status === 200) {
            // put request should respond with the updated object
            setExamInformation(responseFromPutRequest.data)

        } else {
            window.alert('Failed to update...')
        }
    }


    return (
        <Accordion className="my-0" defaultActiveKey="0">
            <Accordion.Item eventKey="0" className="">
                <Accordion.Header>
                    AI Model
                </Accordion.Header>
                <Accordion.Body className="d-flex">
                    <div className="ms-0">Chosen Model: {examInformation.model_name ? examInformation.model_name : 'None Selected'}</div>

                    <div className="ms-auto me-0 d-flex flex-column align-items-end" >
                        <DropdownButton
                            id="dropdown-basic-button"
                            title={selectedAiModel ? selectedAiModel.model_name : "Select a Model"}
                            onSelect={handleSelect}>
                            {aiModelsToChoose.map((aiModel, i) =>
                                <Dropdown.Item
                                    key={i}
                                    eventKey={i}>
                                    {aiModel.model_name}
                                </Dropdown.Item>
                            )}

                        </DropdownButton>
                        {selectedAiModel ?
                            <Button className="my-1 ms-auto" onClick={handleModelUpdate}>
                                Update Model
                            </Button> :
                            <Button className="my-1 ms-auto" disabled onClick={handleModelUpdate}>
                                Update Model
                            </Button>
                        }

                    </div>

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}


export default EditAiModelAccordion