
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

/**
 * `ContentDisplayModal` is a React component that displays a modal with customizable content. 
 * It includes a button to show the modal and a close button to hide it.
 * 
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.contentTitle - The title of the modal.
 * @param {React.ReactNode} props.contentToDisplay - The content to display inside the modal's body.
 * @param {string} [props.size] - The size of the modal (e.g., 'sm', 'lg', 'xl'). Optional.
 * @param {boolean} [props.fullscreen] - If true, the modal will be fullscreen on smaller devices. Optional.
 * @returns {JSX.Element} The `ContentDisplayModal` component.
 *
 * @example
 * // Usage of the ContentDisplayModal component
 * <ContentDisplayModal 
 *   contentTitle="Sample Content" 
 *   contentToDisplay={<div>Here is some content to display in the modal.</div>}
 *   size="lg"
 * />
 */
const ContentDisplayModal = ({ contentTitle, contentToDisplay, size, fullscreen }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Display {contentTitle}
            </Button>

            <Modal show={show} onHide={handleClose} size={size} fullscreen={fullscreen}>
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