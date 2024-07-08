import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import RatingRangeGroupDisplay from '../Exam/dependent components/RatingRangeGroupDisplay';

const ViewRatingsModal = ({ rating_ranges }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Rubric Mark Guidelines
            </Button>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Rubric Mark Guidelines</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RatingRangeGroupDisplay
                        rating_ranges={rating_ranges}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )

}


export default ViewRatingsModal