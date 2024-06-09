import { Container } from "react-bootstrap"
import { useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from "../../BASE_API_URL"

/**
 * 
 * @param {*} submissionType - allowable values = 'EXAM_RUBRIC', 'EXAM_SUBMISSION', 'TRAINING_DATA', 'TRAINING_EXAM'
 * @param {*} setResponseReturn - useState function to adjust response return externally - ie in parent component
 * @returns
 */
function UploadExamInfo({ submissionType, setResponseReturn }) {
    //chosen file
    const [file, setFile] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
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

        default:
            return (
                <div>
                    Invalid submission type
                </div>
            )

    }

    

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (file && submissionType) {

            const formData = new FormData()
            formData.append('file', file)
            formData.append('uploadType', submissionType)

            const postOptions = { headers: { 'Content-Type': 'multipart/form-data' } }
            const responseFromPost = await axios.post(`${BASE_API_URL}file_system/upload`, formData, postOptions)
            setResponseReturn(responseFromPost)
            console.log(file)


            if (responseFromPost.status === 201) {
                console.log('upload successful')
                setUploadedFile(file)

            } else {
                console.log('upload unsuccessful')
            }

        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    return (

        <Container>
            <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3">
                    <Form.Label>
                        Upload {submissionTypeUserText}
                    </Form.Label>
                    <Form.Control
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {uploadedFile ? <> Overwrite</> : <>Upload</>}
                </Button>

            </Form>
            {uploadedFile ? <div> File uploaded: {uploadedFile.name}</div>
                : null}
        </Container>
    )

}






export default UploadExamInfo