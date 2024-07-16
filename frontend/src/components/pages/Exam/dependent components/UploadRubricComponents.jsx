
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'

const UploadRubricComponents = ({ examInformation, setExamInformation }) => {



    const [file, setFile] = useState(null)
    const [fileUploadSuccess, setFileUploadSuccess] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        const { module_id, exam_id } = examInformation


        if (file) {
            try {
                const formData = new FormData()
                formData.append('file', file)
                const postOptions = { headers: { 'Content-Type': 'multipart/form-data' } }
                const postUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/rubric/csv_upload`

                const responseFromPost = await axiosToBackend.post(postUrl, formData, postOptions)
                // update render based on response
                console.log(responseFromPost)
                const updatedRubric = responseFromPost.data
                let updatedExamInformation = { ...examInformation}
                updatedExamInformation.rubric = updatedRubric
                setExamInformation(updatedExamInformation)
                setFileUploadSuccess(true)
            } catch (err) {
                console.log(err)
            }

        } else {
            window.alert('Please upload a csv file')
        }


    }

    async function handleFileChange(e) {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            if (selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile)
            } else {
                setFile(null)
                window.alert('Please upload a csv file')
            }
        }

    }

    return (


        <Container>
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


                <div className='text-success'>{fileUploadSuccess ? 'Successfully uploaded CSV' : null}</div>
            </Form>
        </Container>
    )


}


export default UploadRubricComponents