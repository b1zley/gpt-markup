
import Container from 'react-bootstrap/Container'


import { useParams, Link } from 'react-router-dom'

import { useEffect, useState } from 'react'
import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'


import UploadDownloadFileAccordion from '../../shared/UploadDownloadFileAccordion'
import EditableRubricMarks from './EditableRubricMarks'
import GenerateAICrtiqueButton from './GenerateAICritiqueButton'
import ActiveAccordionControl from '../Exam/dependent components/ActiveAccordionControl'


/**
 * `StudentExamSubmissionView` is a component that displays detailed information about a student's exam submission.
 * It fetches and renders the student's exam submission details, provides options to view the file submission,
 * and allows editing of rubric marks. It also includes a button to generate an AI critique.
 * 
 * @component
 * @example
 * <StudentExamSubmissionView />
 */
const StudentExamSubmissionView = () => {

    const { module_id, exam_id, student_exam_submission_id } = useParams()

    const [examSubmissionInformation, setExamSubmissionInformation] = useState(null)


    const [activeAccordion, setActiveAccodrion] = useState([1, 0])
    const nameArray = ['Submission Upload', 'Rubric Marks']

    useEffect(() => {

        async function handleSubmissionFetch() {
            const apiSubmissionUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}`

            const responseFromFetch = await axiosToBackend.get(apiSubmissionUrl)
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
                <div className='d-flex justify-content-between'>
                    <div>
                        <h3>Module Name: <Link to={`/module/${module_id}`}>{examSubmissionInformation.module_name}</Link> </h3>
                        <h4>Exam: <Link to={`/module/${module_id}/exam/${exam_id}`}>{examSubmissionInformation.exam_name}</Link></h4>
                        <h5>Student Name: {examSubmissionInformation.student_name}</h5>
                        <h5>Student Number: {examSubmissionInformation.student_number}</h5>
                    </div>
                    <div className='mt-auto'>
                        <GenerateAICrtiqueButton
                            setActiveAccodrion={setActiveAccodrion}
                            examSubmissionInformation={examSubmissionInformation}
                            setExamSubmissionInformation={setExamSubmissionInformation}
                        />
                    </div>
                </div>
                <ActiveAccordionControl
                    activeAccordion={activeAccordion}
                    setActiveAccordion={setActiveAccodrion}
                    nameArray={nameArray}
                />


                {activeAccordion[0] === 1 ?
                    <UploadDownloadFileAccordion
                        parentObject={examSubmissionInformation}
                        setParentObject={setExamSubmissionInformation}
                        submissionType={'EXAM_SUBMISSION'}
                        accordionName={'Submission Upload'}
                        lastDisplayed={false}
                        activeDisplay={true}
                    /> :
                    null


                }

                {activeAccordion[1] === 1 ?
                    <EditableRubricMarks
                        examSubmissionInformation={examSubmissionInformation}
                        setExamSubmissionInformation={setExamSubmissionInformation}
                        lastDisplayed={true}
                        activeDisplay={true}
                    />
                    : null}


            </div>
        </Container>



    )
}


export default StudentExamSubmissionView