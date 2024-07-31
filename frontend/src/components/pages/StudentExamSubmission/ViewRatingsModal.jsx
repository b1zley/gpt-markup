import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import RatingRangeGroupDisplay from '../Exam/dependent components/RatingRangeGroupDisplay';


/**
 * `ViewRatingsModal` is a component that displays a modal dialog showing rubric mark guidelines.
 * The modal includes a button to open it, and it contains a `RatingRangeGroupDisplay` component
 * that displays the rubric rating ranges. The modal can be closed by clicking the "Close" button or
 * the modal header's close button.
 * 
 * @component
 * @param {Object[]} rating_ranges - An array of rating range objects to be displayed in the modal.
 * @returns {JSX.Element} The `ViewRatingsModal` component.
 * 
 * @example
 * <ViewRatingsModal rating_ranges={someRatingRangesArray} />
 */
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