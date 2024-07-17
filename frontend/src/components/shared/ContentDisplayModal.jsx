
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


const ContentDisplayModal = ({ contentTitle, contentToDisplay, size }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Display {contentTitle}
            </Button>

            <Modal show={show} onHide={handleClose} size={size}>
                <Modal.Header closeButton>
                    <Modal.Title>{contentTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contentToDisplay ? <>{contentToDisplay}</> : 'No content'}
                    
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


export default ContentDisplayModal