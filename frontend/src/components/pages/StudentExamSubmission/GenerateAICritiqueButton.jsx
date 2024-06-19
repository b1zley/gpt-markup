
import Button from 'react-bootstrap/Button'
import BASE_API_URL from '../../../BASE_API_URL'

import axiosToBackend from '../../../axiosToBackend'


const GenerateAICrtiqueButton = ({ examSubmissionInformation, setExamSubmissionInformation }) => {

    const { module_id, exam_id, student_exam_submission_id } = examSubmissionInformation
    async function handleGenerateButtonClick() {
        const postUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}/ai`
        const responseFromPost = await axiosToBackend.post(postUrl)
        if (responseFromPost.status === 201) {
            setExamSubmissionInformation(responseFromPost.data)
        } else {
            window.alert('failed to generate ai critique')
        }

    }

    if(!examSubmissionInformation.file_system_id){
        return(
            <Button
            className='mb-1'
            disabled
        >
            Upload Submission to Generate Critique
        </Button>
        )
    }

    return (
        <Button
            className='mb-1'
            onClick={handleGenerateButtonClick}
        >
            Generate AI Critique
        </Button>
    )

}

export default GenerateAICrtiqueButton