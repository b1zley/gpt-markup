import { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import UploadRTFControls from './UploadRTFControls'

/**
 * A React component that provides a modal dialog for uploading text as an RTF file.
 * 
 * This component displays a button that, when clicked, opens a modal dialog. The modal allows users
 * to upload RTF formatted text related to a specific parameter of a parent object.
 *
 * @component
 * @example
 * ```jsx
 * <UploadTextAsRTF 
 *   parentObject={parentObject}
 *   setParentObject={setParentObject}
 *   param="textParam"
 *   userFriendlyParam="Text"
 *   editText={editText}
 *   setEditText={setEditText}
 *   handleCommitClicked={handleCommitClicked}
 * />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {Object} props.parentObject - The parent object that will be modified.
 * @param {Function} props.setParentObject - Function to update the parent object.
 * @param {string} props.param - The specific parameter of the parent object to be modified.
 * @param {string} props.userFriendlyParam - A user-friendly name for the parameter, used in the UI.
 * @param {string} props.editText - The current text content being edited.
 * @param {Function} props.setEditText - Function to update the edited text content.
 * @param {Function} props.handleCommitClicked - Function to handle the commit action after the RTF file is uploaded.
 *
 * @returns {React.Element} The rendered component.
 */
const UploadTextAsRTF = ({ parentObject,
    setParentObject,
    param,
    userFriendlyParam,
    editText,
    setEditText,
    handleCommitClicked
}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div >
            <Button variant="primary" onClick={handleShow} className="ms-auto" style={{ height: '38px' }}>
                Upload
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload {userFriendlyParam}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Please upload the {userFriendlyParam} in RTF format.</div>
                    <UploadRTFControls
                        parentObject={parentObject}
                        setParentObject={setParentObject}
                        param={param}
                        userFriendlyParam={userFriendlyParam}
                        editText={editText}
                        setEditText={setEditText}
                        handleCommitClicked={handleCommitClicked}
                    />



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


export default UploadTextAsRTF