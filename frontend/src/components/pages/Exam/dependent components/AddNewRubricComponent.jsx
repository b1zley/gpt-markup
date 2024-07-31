
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'



/**
 * A component for adding a new rubric component to an exam.
 * 
 * This component provides a form for users to add a new rubric component to an exam. Upon form submission, it sends a POST request to create the new component and updates the exam information.
 * 
 * @component
 * @example
 * ```jsx
 * <AddNewRubricComponent
 *   examInformation={examInformation}
 *   setExamInformation={setExamInformation}
 * />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.examInformation - An object containing the exam details.
 * @param {number} props.examInformation.module_id - The ID of the module.
 * @param {number} props.examInformation.exam_id - The ID of the exam.
 * @param {Array} props.examInformation.rubric - The current list of rubric components for the exam.
 * @param {Function} props.setExamInformation - Function to update the exam information.
 * 
 * @returns {React.Element} The rendered component for adding a new rubric component.
 */
const AddNewRubricComponent = ({ examInformation, setExamInformation }) => {

    const [newRubricComponentName, setNewRubricComponentName] = useState('')

    const location = useLocation()
    const navigate = useNavigate()

    console.log(location)
    function handleRedirectToNewComponent(rubric_component_id){
        const newUrl = `${location.pathname}/rubric_component/${rubric_component_id}`
        navigate(newUrl)
        
    }

    async function handleRubricFormSubmit(event) {
        event.preventDefault()
        if (newRubricComponentName === '') {
            window.alert('Please set a rubric component name!')
            return
        }
        const postNewRubricComponentURL = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/rubric`
        const postBody = {
            rubric_component_name: newRubricComponentName
        }
        const responseFromPostNewComponent = await axiosToBackend.post(postNewRubricComponentURL, postBody)
        console.log(responseFromPostNewComponent)
        if (responseFromPostNewComponent.status === 201) {
            const newRubricComponentId = responseFromPostNewComponent.data.rubric_component_id
            // now dynamically add the new rubric
            let newRubricList = examInformation.rubric.slice(0, examInformation.rubric.length)
            const newRubricComponent = {
                component_order: null,
                exam_id: examInformation.exam_id,
                maximum: null,
                name: newRubricComponentName,
                rating_ranges: [],
                rubric_component_desc: null,
                rubric_component_id: newRubricComponentId
            }
            newRubricList.push(newRubricComponent)
            let newExamInformation = { ...examInformation }
            newExamInformation.rubric = newRubricList

            setExamInformation(newExamInformation)
            setNewRubricComponentName('')

            handleRedirectToNewComponent(newRubricComponentId)
        } else {
            window.alert('Failed to create new rubric')
        }
    }

    return (
        <div className='my-2'>
            <h6>
                Add a new rubric component...
            </h6>
            <Form onSubmit={handleRubricFormSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Rubric Component Name"
                        onChange={(event) => { setNewRubricComponentName(event.target.value) }}
                        value={newRubricComponentName}
                    />
                </Form.Group>
                <Button type='submit'>
                    Add Component
                </Button>
            </Form>
        </div>
    )

}


export default AddNewRubricComponent