import { useState, useEffect } from 'react';
import { Container, Form, Dropdown, Button } from 'react-bootstrap';
import axios from 'axios'

import BASE_API_URL from '../../BASE_API_URL';

const CreateExam = ({ loggedInSuperUser, createdExam }) => {
    const [accessibleModules, setAccessibleModules] = useState([]);

    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [selectedModuleName, setSelectedModuleName] = useState(null);

    const [selectedExamName, setSelectedExamName] = useState(null)

    const [createdExamText, setCreatedExamText] = useState(null)

    const fetchAndSetAccessibleModules = async (super_user_id) => {
        const responseFromGetModulesBySuperUserId =  await axios.get(`${BASE_API_URL}module/*/super_user_id/${super_user_id}`)
        setAccessibleModules(responseFromGetModulesBySuperUserId.data)
    }
    


    useEffect(() => {
        fetchAndSetAccessibleModules(loggedInSuperUser.super_user_id)
    }, []);

    const handleSelectModule = (eventKey) => {
        const selectedModule = JSON.parse(eventKey);
        console.log(selectedModule)
        console.log("Selected Module:", selectedModule);
        setSelectedModuleId(selectedModule.module_id);
        setSelectedModuleName(selectedModule.module_name);
    };


    const handleExamNameChange = (event) => {
        setSelectedExamName(event.target.value)
    }


    const handleExamCreationSubmit = async (event) => {
        
        event.preventDefault()
        // build json object
        const moduleId = selectedModuleId
        const examCreationObject = {
            "exam_name": selectedExamName
        }
        const url = `${BASE_API_URL}module/${moduleId}/exam`
        const responseFromExamPost = await axios.post(url, examCreationObject)

        if(responseFromExamPost.status === 201){
            setCreatedExamText(`You created ${selectedExamName}`)
        } else{
            setCreatedExamText(`Failed to create ${selectedExamName}`)
        }


    }

    return (
        <Container>
            <Form onSubmit={handleExamCreationSubmit}>
                {/* handle module id */}
                <Form.Group controlId="formDropdown">
                    <Form.Label>Select a module</Form.Label>
                    <Dropdown onSelect={handleSelectModule}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedModuleName ? selectedModuleName : 'Select a module'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {accessibleModules.map((module) => (
                                <Dropdown.Item key={module.module_id} eventKey={JSON.stringify(module)}>
                                    {module.module_name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                {/* handle exam name */}
                <Form.Group>
                    <Form.Label>Exam Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter exam name" onChange={handleExamNameChange} />
                </Form.Group>
                <Button type='submit'>
                    Create Exam
                </Button>
                {createdExamText ? <div>{createdExamText}</div> : null}
            </Form>
        </Container>
    );
};

export default CreateExam;
