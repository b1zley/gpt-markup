
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {useState} from 'react'
import AddNewMarkingRangeModalDialogBox from './AddNewMarkingRangeModalDialogBox';
import useConfirmation from '../../../hooks/useConfirmation';




/**
 * `AddNewMarkingRangeModalButton` is a button component that triggers a modal dialog for adding a new marking range to a rubric component.
 * 
 * This component renders a button that, when clicked, opens a modal dialog containing a form to add a new marking range.
 * The modal includes an instance of the `AddNewMarkingRangeModalDialogBox` component.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.rubricComponent - The rubric component object containing current rating ranges
 * @param {Function} props.setRubricComponent - Function to update the rubric component state
 * 
 * @example
 * <AddNewMarkingRangeModalButton
 *   rubricComponent={rubricComponent}
 *   setRubricComponent={setRubricComponent}
 * />
 */
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