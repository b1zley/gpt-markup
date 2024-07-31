import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';


/**
 * `useConfirmation` is a custom React hook that provides a way to display a confirmation modal
 * and handle user responses. It returns a function to trigger the confirmation modal and a modal
 * component to be included in the render tree.
 * 
 * @returns {[Function, Function]} An array where:
 *   - The first element is a function `confirm` that triggers the confirmation modal.
 *   - The second element is a `ConfirmationModal` component that should be included in the render tree.
 * 
 * @example
 * const [confirm, ConfirmationModal] = useConfirmation();
 * 
 * const handleAction = async () => {
 *   const result = await confirm('Are you sure you want to proceed?');
 *   if (result) {
 *     // Handle confirmation
 *   } else {
 *     // Handle cancellation
 *   }
 * };
 * 
 * return (
 *   <div>
 *     <Button onClick={handleAction}>Trigger Action</Button>
 *     <ConfirmationModal />
 *   </div>
 * );
 */
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

    const ConfirmationModal = ({hideClose}) => (
        <Modal show={confirmationState.isOpen} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>{confirmationState.message}</Modal.Body>
            <Modal.Footer>
                
                {hideClose ? null : <Button variant="secondary" onClick={() => handleClose(false)}>
                    Cancel
                </Button>}
                
                <Button variant="primary" onClick={() => handleClose(true)}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return [confirm, ConfirmationModal];
};

export default useConfirmation;