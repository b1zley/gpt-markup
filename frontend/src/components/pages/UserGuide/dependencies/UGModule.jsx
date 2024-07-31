import { Container, Row, Col } from "react-bootstrap"



const UGModule = () => {


    return (
        <>
            <Container className="my-3">

                <Row>
                    <Col>
                        <h3>
                            Viewing Modules
                        </h3>
                        <p>
                            To view modules, click on the 'Modules' option of the navbar.
                            After this, you will be faced with a list of all modules you have access to, with their exams. Click on a Module to view specific information on that Module.
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>
                            Creating a new Module
                        </h3>
                        <p>
                            From the 'Modules' view, scroll to the 'Create Module' component.
                            Enter the desired name for the Module and click 'Create Module'.
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>
                            Deleting a Module
                        </h3>
                        <p>
                            From the 'Modules' view, scroll to the 'Modules' component.
                            Find the Module you wish to be deleted, then click the corresponding delete button.
                            This will cause a dialog box prompting you to confirm your selection to appear. Click 'Confirm' to progress with the deletion. Click 'Cancel' to stop the deletion.
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>
                            Assigning Lecturers to a Module
                        </h3>
                        <p>
                            From the Module you wish to assign a lecturer to, scroll to the 'Lecturers Assigned' component.
                            Click on the 'Select a lecturer' dropdown, then select the lecturer to be added.
                            Click the 'Add Lecturer' button, the Lecturers assigned list will be updated to include this lecturer.
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>
                            Removing Lecturers from a Module
                        </h3>
                        <p>
                            From the Module you wish to remove a lecturer from, scroll to the 'Lecturers Assigned' component.
                            Find the lecturer you wish to remove access from in the 'Lecturers Assigned' list.
                            Click the corresponding 'Remove Access' button.
                            The 'Lecturers Assigned' list will be updated to no longer include this lecturer.  
                        </p>
                    </Col>
                </Row>

            </Container>
        </>
    )

}

export default UGModule