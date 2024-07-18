import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const useConfirmation = () => {
    const [confirmationState, setConfirmationState] = useState({ isOpen: false, resolve: null });

    const confirm = (message) => {
        const promise = new Promise((resolve) => {
            setConfirmationState({ isOpen: true, message, resolve });
        });
        return promise
    };

    const handleClose = (result) => {
        confirmationState.resolve(result);
        setConfirmationState({ isOpen: false, resolve: null });
    };

    const ConfirmationModal = () => (
        <Modal show={confirmationState.isOpen} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>{confirmationState.message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => handleClose(true)}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return [confirm, ConfirmationModal];
};

export default useConfirmation;