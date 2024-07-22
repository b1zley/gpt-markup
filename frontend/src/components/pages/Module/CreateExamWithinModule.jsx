import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'
import useConfirmation from '../../hooks/useConfirmation'


const CreateExamWithinModule = ({ module_id, examsWithinModule, setExamsWithinModule }) => {

    const [selectedExamName, setSelectedExamName] = useState(null)

    const [confirm, ConfirmationModal] = useConfirmation()

    const handleExamCreation = async (event) => {
        try {
            event.preventDefault()
            if (!selectedExamName) {
                window.alert('Enter an exam name')
                return
            }
    
            const apiUrl = `${BASE_API_URL}module/${module_id}/exam`
            const requestBody = { exam_name: selectedExamName }
    
    
            // send api request
            const responseFromCreateExamRequest = await axiosToBackend.post(apiUrl, requestBody)
            console.log(responseFromCreateExamRequest)
            const returnedExamId = responseFromCreateExamRequest.data.exam_id
            // do stuff with response
    
            if (responseFromCreateExamRequest.status === 201) {
                let newArray = [].concat(examsWithinModule)
                newArray.push({
                    chosen_ai_model_id: null,
                    exam_id: returnedExamId,
                    exam_name: selectedExamName,
                    exam_question: null,
                    file_system_id: null,
                    model_answer: null,
                    module_id,
                    prompt_specifications: null,
                    rubric: null
                })
                setExamsWithinModule(newArray)
    
            } 
    
        } catch (error) {
            await confirm('Failed to create exam')
        }
    }

    const handleExamNameChange = (event) => {
        setSelectedExamName(event.target.value)
    }


    return (
        <div className='mx-auto mt-4 mb-2 border border-light rounded p-3' style={{ width: '50%' }}>
            <h4>
                Create Exam
            </h4>
            <Form onSubmit={handleExamCreation}>
                <Form.Group controlId="formDropdown" className='my-1'>
                    
                    <Form.Control type="text" placeholder="Enter exam name" onChange={handleExamNameChange} />
                </Form.Group>
                <Button type="submit" className='my-1'>
                    Create Exam
                </Button>
            </Form>
            <ConfirmationModal />
        </div>
    )
}


export default CreateExamWithinModule