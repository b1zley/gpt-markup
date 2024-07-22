import { Container } from "react-bootstrap"
import { useState, Fragment } from 'react'
import axiosToBackend from '../../axiosToBackend'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from "../../BASE_API_URL"
import useConfirmation from "../hooks/useConfirmation"

/**
 * 
 * @param {*} submissionType - allowable values = 'EXAM_RUBRIC', 'EXAM_SUBMISSION', 'TRAINING_DATA', 'TRAINING_EXAM'
 * @param {*} setResponseReturn - useState function to adjust response return externally - ie in parent component
 * @returns
 */
function UploadExamInfo({ submissionType, handleExamUpload }) {
    //chosen file
    const [file, setFile] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)

    const [confirm, ConfirmationModal] = useConfirmation()

    let submissionTypeUserText = ''
    switch (submissionType) {
        case 'EXAM_SUBMISSION':
            submissionTypeUserText = 'Exam Submission'
            break;

        case 'EXAM_RUBRIC':
            submissionTypeUserText = 'Exam Rubric'
            break;

        case 'TRAINING_DATA':
            submissionTypeUserText = 'Training Data'
            break;

        case 'TRAINING_EXAM':
            submissionTypeUserText = 'Training Exam'
            break;
        case 'EXAM_MODEL_ANSWER':
            submissionTypeUserText = 'Exam Model Answer'
            break;

        default:
            return (
                <div>
                    Invalid submission type
                </div>
            )

    }



    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if (file && submissionType) {
    
                const formData = new FormData()
                formData.append('file', file)
                formData.append('uploadType', submissionType)
    
                const postOptions = { headers: { 'Content-Type': 'multipart/form-data' } }
                const responseFromPost = await axiosToBackend.post(`${BASE_API_URL}file_system/upload`, formData, postOptions)
                handleExamUpload(responseFromPost)
    
    
                if (responseFromPost.status === 201) {
                    setUploadedFile(file)
    
                } else {
                    console.log('upload unsuccessful')
                }
    
            } else {
                window.alert('Please upload a zip file')
            }
        } catch (error) {
            await confirm('Failed to upload new')
        }
    }

    const handleFileChange = (e) => {
        console.log('hello from file change')
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            console.log('hello from file change again')
            if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
                setFile(selectedFile);
            } else {
                setFile(null);
                window.alert('Please upload a zip file')
            }
        }
    }

    return (


        <div>
            <ConfirmationModal />
            <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3">
                    <Form.Control
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                {file ?
                    <Button variant="primary" type="submit">
                        Upload New
                    </Button> :
                    <Button disabled variant="primary" type="submit">
                        Upload New
                    </Button>
                }
            </Form>
            {uploadedFile ? <div> File uploaded: {uploadedFile.name}</div>
                : <div> File uploaded: None New</div>}
        </div>

    )

}






export default UploadExamInfo