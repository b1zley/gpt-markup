
import Container from 'react-bootstrap/Container'

import { useParams, Link } from 'react-router-dom'

import { useEffect, useState } from 'react'
import BASE_API_URL from '../../../BASE_API_URL'
import axios from 'axios'
import UploadDownloadFileAccordion from '../../shared/UploadDownloadFileAccordion'
import EditableRubricMarks from './EditableRubricMarks'

const StudentExamSubmissionView = () => {

    const { module_id, exam_id, student_exam_submission_id } = useParams()

    const [examSubmissionInformation, setExamSubmissionInformation] = useState(null)

    console.log(examSubmissionInformation)
    useEffect(() => {

        async function handleSubmissionFetch() {
            const apiSubmissionUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}`

            const responseFromFetch = await axios.get(apiSubmissionUrl)
            setExamSubmissionInformation(responseFromFetch.data)

        }

        handleSubmissionFetch()
    }, [module_id, exam_id, student_exam_submission_id])



    if (!examSubmissionInformation) {
        return (
            <Container>
                <div className='border border-light rounded p-3 d-flex flex-column' style={{ minHeight: '350px', flex: 1 }}>
                Pending...
                </div>
            </Container>



        )
    }

    return (
        <Container>
            <div className='border border-light rounded p-3 d-flex flex-column' style={{ minHeight: '350px', flex: 1 }}>
                <h3>Module Name: <Link to={`/module/${module_id}`}>{examSubmissionInformation.module_name}</Link> </h3>
                <h4>Exam: <Link to={`/module/${module_id}/exam/${exam_id}`}>{examSubmissionInformation.exam_name}</Link></h4>
                <h5>Student Name: {examSubmissionInformation.student_name}</h5>
                <h5>Student Number: {examSubmissionInformation.student_number}</h5>

                <UploadDownloadFileAccordion
                    parentObject={examSubmissionInformation}
                    setParentObject={setExamSubmissionInformation}
                    submissionType={'EXAM_SUBMISSION'}
                    accordionName={'Submission Upload'}
                    lastDisplayed={false}
                    activeDisplay={true}
                />
                <EditableRubricMarks
                    examSubmissionInformation={examSubmissionInformation}
                    setExamSubmissionInformation={setExamSubmissionInformation}
                    lastDisplayed={true}
                    activeDisplay={true}
                />
                

            </div>
        </Container>



    )
}


export default StudentExamSubmissionView