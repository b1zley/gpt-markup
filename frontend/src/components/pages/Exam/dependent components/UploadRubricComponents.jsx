
import { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'
import useConfirmation from '../../../hooks/useConfirmation'

/**
 * A React component that handles the upload of rubric components via a CSV file.
 * 
 * This component allows users to upload a CSV file that contains rubric components. 
 * Upon successful upload, the rubric data is updated in the parent `examInformation` object.
 *
 * @component
 * @example
 * ```jsx
 * <UploadRubricComponents 
 *   examInformation={examInformation}
 *   setExamInformation={setExamInformation}
 * />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {Object} props.examInformation - The exam information object that contains details like module ID and exam ID.
 * @param {Function} props.setExamInformation - Function to update the exam information object, specifically with the uploaded rubric data.
 *
 * @returns {React.Element} The rendered component.
 */
const UploadRubricComponents = ({ examInformation, setExamInformation }) => {

    const [confirm, ConfirmationModal] = useConfirmation()

    const [file, setFile] = useState(null)
    const [fileUploadSuccess, setFileUploadSuccess] = useState(false)

    const fileInputRef = useRef(null); // Create a ref for the file input


    /**
     * Handles the form submission to upload the CSV file.
     * 
     * @async
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
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
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset the file input
                }
                if(err.response){
                    const responseData = err.response.data

                    // handle range check
                    if(responseData === 'Range Max > Max Points'){
                        // need confirm
                        return await confirm('Could not parse CSV file, a rubric component has Range Max > Max Points')
                    } else if(responseData === 'Range Overlap'){
                        // need confirm
                        return await confirm('Could not parse CSV file, a rubric component contains a Range Overlap')
                    }

                    // handle max check

                }

            }
            

        } else {
            window.alert('Please upload a csv file')
        }


    }

    /**
     * Handles file selection and validates the file type.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
     */
    async function handleFileChange(e) {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            if (selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile)
            } else {
                setFile(null)
                window.alert('Please upload a csv file')
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset the file input
                }
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
                        ref={fileInputRef}
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

            <ConfirmationModal />
        </Container>
    )


}


export default UploadRubricComponents