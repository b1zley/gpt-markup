import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import BootstrapTick from '../../../icons/BootstrapTick'

import { useState, useEffect } from 'react'
import axios from 'axios'
import BASE_API_URL from '../../../../BASE_API_URL'

import { useLocation } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import StudentExamSubmissionsTable from './StudentExamSubmissionsTable'
import AddStudentExamSubmission from './AddStudentExamSubmission'





const StudentsInExamAccordion = ({ lastDisplayed, examInformation }) => {

    const [studentExamSubmissions, setStudentExamSubmissions] = useState([])
    const location = useLocation()

    

    useEffect(() => {
        async function handleStudentExamSubmissionsFetch() {
            // fetch student exam submission from api
            const apiFetchExamSubmissionsUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/student_exam_submission`
            const responseFromFetchExams = await axios.get(apiFetchExamSubmissionsUrl)
            const newExamSubmissions = responseFromFetchExams.data
            // handle setting state from response data
            setStudentExamSubmissions(newExamSubmissions)
            console.log(newExamSubmissions)


        }
        handleStudentExamSubmissionsFetch()

    }, [examInformation])


    return (
        <Accordion className="my-0">
            <Accordion.Item eventKey="0" className={lastDisplayed ? '' : "border-bottom-0"}>
                <Accordion.Header>
                    Student Submissions
                </Accordion.Header>
                <Accordion.Body >
                    <StudentExamSubmissionsTable
                        examInformation={examInformation}
                        studentExamSubmissions={studentExamSubmissions}
                        setStudentExamSubmissions={setStudentExamSubmissions}
                    />
                    <hr className='divider' />
                    <AddStudentExamSubmission
                        examInformation={examInformation}
                        studentExamSubmissions={studentExamSubmissions}
                        setStudentExamSubmissions={setStudentExamSubmissions}
                    />


                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}



export default StudentsInExamAccordion