import { useState, useEffect } from 'react';
import { Container, Form, Dropdown, Button } from 'react-bootstrap';
import axios from 'axios'

import BASE_API_URL from '../../BASE_API_URL';

const CreateExam = ({ loggedInSuperUser, createdExam }) => {
    const [accessibleModules, setAccessibleModules] = useState([]);

    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [selectedModuleName, setSelectedModuleName] = useState(null);

    const [selectedExamName, setSelectedExamName] = useState(null)

    

    // simulate get request for now...
    const firstModule = { module_name: 'First Module', module_id: 1 };
    const secondModule = { module_name: 'Second Module', module_id: 2 };

    useEffect(() => {
        setAccessibleModules([firstModule, secondModule]);
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


    const handleExamCreationSubmit = async (event) =>{
        event.preventDefault()
        // build json object
        const moduleId = selectedModuleId
        const examCreationObject = {
            "exam_name":selectedExamName
        }
        const url = `${BASE_API_URL}module/${moduleId}/exam`
        console.log(url)


        const responseFromExamPost = await axios.post(url,examCreationObject)
        console.log(responseFromExamPost)
        

    }

    return (
        <Container>
            <Form onSubmit={handleExamCreationSubmit}>
                {/* handle module id */}
                <Form.Group controlId="formDropdown">
                    <Form.Label>Select a module</Form.Label>
                    <Dropdown  onSelect={handleSelectModule}>
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
            </Form>
        </Container>
    );
};

export default CreateExam;
