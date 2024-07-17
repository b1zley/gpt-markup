
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table'
import UploadRubricComponents from './UploadRubricComponents';


const UploadRubricComponentsModal = ({ examInformation, setExamInformation }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const tableHeadings = [
        'Rubric Component Name', 'Rubric Component Desc',
        'Max Points', 'Range 1 Desc', 'Range 1 Min',
        'Range 1 Max', 'Range 2 Desc', 'Range 2 Min',
        'Range 2 Max'
    ]

    const row1Examples = [
        'Example Component 1', 'This is the description for example component 1', '6', 'EXCELLENT', '5', '6', 'BAD', '0', '4.99'
    ]

    const row2Examples = [
        'Example Component 2', 'This is the description for example component 2', '1', 'GOOD', '1', '1', null, null, null
    ]

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Upload Components as CSV
            </Button>

            <Modal show={show} onHide={handleClose} fullscreen={false} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Upload multiple rubric components as a CSV!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div >
                        Upload your rubric components in the following format, as a csv file.
                    </div>
                    <div className='mb-2'>
                        Also be aware that different numbers of rating ranges can be used for each rubric component!
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {tableHeadings.map((tableHeading, i) =>
                                    <th key={i}>
                                        {tableHeading}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {row1Examples.map((cell, i) =>
                                    <td key={i}>
                                        {cell}
                                    </td>
                                )}
                            </tr>

                            <tr>
                                {row2Examples.map((cell, i) =>
                                    <td key={i}>
                                        {cell}
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </Table>

                    <hr className='divider' />
                    <UploadRubricComponents
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default UploadRubricComponentsModal