
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {useState} from 'react'
import AddNewMarkingRangeModalDialogBox from './AddNewMarkingRangeModalDialogBox';
import useConfirmation from '../../../hooks/useConfirmation';


const AddNewMarkingRangeModalButton = ({rubricComponent, setRubricComponent}) => {




    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>  
            <Button variant="primary" onClick={handleShow}>
                Add new marking range
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new marking range</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <AddNewMarkingRangeModalDialogBox
                        rubricComponent={rubricComponent}
                        setRubricComponent={setRubricComponent}
                        setShowModal={setShow}
                    />


                </Modal.Body>
                
            </Modal>
        </>
    );

}


export default AddNewMarkingRangeModalButton