
import { useState } from 'react'


import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


import axiosToBackend from '../../../../axiosToBackend'
import BASE_API_URL from '../../../../BASE_API_URL'
import useConfirmation from '../../../hooks/useConfirmation'

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