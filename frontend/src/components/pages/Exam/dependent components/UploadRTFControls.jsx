
import { useState } from 'react'


import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


import axiosToBackend from '../../../../axiosToBackend'
import BASE_API_URL from '../../../../BASE_API_URL'
import useConfirmation from '../../../hooks/useConfirmation'


/**
 * A React component that provides controls for uploading an RTF file and converting its content to plain text.
 * 
 * This component allows users to select an RTF file, upload it to a backend service for conversion to plain text, 
 * and then update a parent object's text field with the converted content.
 *
 * @component
 * @example
 * ```jsx
 * <UploadRTFControls 
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
 * @param {Object} props.parentObject - The parent object that will be updated with the converted text.
 * @param {Function} props.setParentObject - Function to update the parent object.
 * @param {string} props.param - The specific parameter of the parent object to be modified.
 * @param {string} props.userFriendlyParam - A user-friendly name for the parameter, used in the UI.
 * @param {string} props.editText - The current text content being edited.
 * @param {Function} props.setEditText - Function to update the edited text content.
 * @param {Function} props.handleCommitClicked - Function to handle the commit action after the RTF file is uploaded and converted.
 *
 * @returns {React.Element} The rendered component.
 */
const UploadRTFControls = ({ parentObject, setParentObject, param, userFriendlyParam, editText, setEditText, handleCommitClicked }) => {

    //chosen file
    const [file, setFile] = useState(null)
    const [confirm, ConfirmationModal] = useConfirmation()

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(file)
        if (file) {
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('uploadType', param)

                const postOptions = { headers: { 'Content-Type': 'multipart/form-data' } }
                const responseFromPost = await axiosToBackend.post(`${BASE_API_URL}convert/RtfToPlainText`, formData, postOptions)

                // response should include file text 
                const textFromRTF = responseFromPost.data.content

                // update render
                setEditText(textFromRTF)
                handleCommitClicked(e, textFromRTF)
            } catch (err) {
                await confirm('Failed to upload RTF')
            }


        } else {
            window.alert('Please upload a zip file')
        }


    }



    async function handleFileChange(e) {
        console.log('hello from file change')
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            console.log('hello from file change again')
            if (selectedFile.name.endsWith('.rtf')) {
                setFile(selectedFile);
            } else {
                setFile(null);
                window.alert('Please upload an RTF file')
            }
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3">
                    <Form.Control
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                {file ?
                    <Button variant="primary" type="submit" id='rtfUploadNewButton'>
                        Upload New
                    </Button> :
                    <Button disabled variant="primary" type="submit">
                        Upload New
                    </Button>
                }
            </Form>
            <ConfirmationModal hideClose={true} />
            {/* {uploadedFile ? <div> File uploaded: {uploadedFile.name}</div>
                : <div> File uploaded: None New</div>} */}
        </>
    )

}

export default UploadRTFControls