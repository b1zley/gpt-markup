
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useState, useEffect } from 'react'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'
import useConfirmation from '../../../hooks/useConfirmation'

const CreateModule = ({ modules, setModules }) => {
    const [inputModuleName, setInputModuleName] = useState('')

    const [confirm, ConfirmationModal] = useConfirmation()

    async function handleInputNameChange(event) {
        setInputModuleName(event.target.value)
    }
    async function handleFormSubmit(event) {
        try {
            event.preventDefault()
            const postUrl = `${BASE_API_URL}module`
            const postBody = {
                "module_name": inputModuleName
            }
            const responseFromPost = await axiosToBackend.post(postUrl, postBody)
            if(responseFromPost.status === 201){
                // do stuff
                let updatedModules = modules.slice(0,modules.length)
    
                let newModule = {
                    module_id : responseFromPost.data.module_id,
                    module_name : inputModuleName,
                    exams:[]
                }
                updatedModules.push(newModule)
                setModules(updatedModules)
            } 
        } catch (error) {
            await confirm('Failed to create new exam')
        }
    }


    return (
        <div className='mx-auto mt-4 mb-2 border border-light rounded p-3' style={{ width: '50%' }}>
            <h4>
                Create Module
            </h4>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formDropdown" className='my-1'>
                    <Form.Control
                        type="text"
                        placeholder="Enter module name"
                        value={inputModuleName}
                        onChange={handleInputNameChange}
                    />
                </Form.Group>
                <Button type="submit" className='my-1'>
                    Create Module
                </Button>
            </Form>
            <ConfirmationModal />
        </div>
    )

}

export default CreateModule