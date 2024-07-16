import { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import UploadRTFControls from './UploadRTFControls'


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