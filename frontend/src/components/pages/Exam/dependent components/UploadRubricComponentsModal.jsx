
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
        'rubric component name', 'rubric component desc',
        'max points', 'range 1 desc', 'range 1 min',
        'range 1 max', 'range 2 desc', 'range 2 min',
        'range 2 max'
    ]

    const row1Examples = [
        'Program Functionality', 'This is the description for program functionality', '6', 'EXCELLENT', '5', '6', 'SHIT', '0', '4.99'
    ]

    const row2Examples = [
        'ANOTHER COMPONENT', 'This is another component desc', '1', 'GOOD', '1', '1', null, null, null
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