
import Button from 'react-bootstrap/Button'
import LoadingSpinner from '../../shared/LoadingSpinner'
import BASE_API_URL from '../../../BASE_API_URL'

import axiosToBackend from '../../../axiosToBackend'

import { useState } from 'react'


/**
 * `GenerateAICrtiqueButton` is a component that triggers the generation of an AI critique for an exam submission.
 * It displays a button which, when clicked, makes a request to generate the critique. The button's state
 * changes based on the loading status and the state of the exam submission.
 *
 * The component also handles different states, such as:
 * - Loading state, showing a spinner.
 * - Disabled state if the exam is not locked or if no submission is uploaded.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setActiveAccodrion - Function to update the active accordion state.
 * @param {Object} props.examSubmissionInformation - Information about the student exam submission.
 * @param {Function} props.setExamSubmissionInformation - Function to update the exam submission information.
 * @returns {JSX.Element} The `GenerateAICrtiqueButton` component.
 *
 * @example
 * <GenerateAICrtiqueButton
 *   setActiveAccodrion={setAccordion}
 *   examSubmissionInformation={examSubmissionInfo}
 *   setExamSubmissionInformation={setSubmissionInfo}
 * />
 */
const GenerateAICrtiqueButton = ({ setActiveAccodrion, examSubmissionInformation, setExamSubmissionInformation }) => {

    console.log(examSubmissionInformation)
    const [isLoading, setIsLoading] = useState(false)

    const { module_id, exam_id, student_exam_submission_id } = examSubmissionInformation
    async function handleGenerateButtonClick() {


        for (let i = 0; i < 1; i++) {
            const postUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}/ai`
            try {
                setIsLoading(true)
                const responseFromPost = await axiosToBackend.post(postUrl)
                setIsLoading(false)
                setActiveAccodrion([0,1])
                if (responseFromPost.status === 201) {
                    setExamSubmissionInformation(responseFromPost.data)
                } else {
                    window.alert('failed to generate ai critique')
                }
            } catch (err) {
                window.alert('failed to generate ai critique')
                console.log(err)
            }
        }
    }

    if(isLoading){
        return(
            <Button
                className='mb-1'
                style={{width: '168px', height:'38px'}}
                disabled >
                <LoadingSpinner size={1}/>
            </Button>
        )
    }

    if (!examSubmissionInformation.is_locked) {
        return (
            <Button
                className='mb-1'
                disabled >
                Lock Exam from Checklist to generate critique
            </Button>
        )
    }

    if (!examSubmissionInformation.file_system_id) {
        return (
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