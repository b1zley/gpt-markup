
import Button from 'react-bootstrap/Button'
import BASE_API_URL from '../../../BASE_API_URL'

import axiosToBackend from '../../../axiosToBackend'

import { useState } from 'react'

const GenerateAICrtiqueButton = ({ examSubmissionInformation, setExamSubmissionInformation }) => {

    console.log(examSubmissionInformation)

    const { module_id, exam_id, student_exam_submission_id } = examSubmissionInformation
    async function handleGenerateButtonClick() {


        for (let i = 0; i < 1; i++) {
            const postUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}/ai`
            try {
                const responseFromPost = await axiosToBackend.post(postUrl)
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
        console.log('loop finished...')
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