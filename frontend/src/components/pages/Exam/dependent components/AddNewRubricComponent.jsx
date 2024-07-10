
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'

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