import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import BootstrapTick from '../../../../icons/BootstrapTick'

import { useState, useEffect } from 'react'
import axios from 'axios'
import BASE_API_URL from '../../../../../BASE_API_URL'

import { useLocation } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'





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


    async function handleStudentRemoveClick(i){
        console.log(i)
        console.log(studentExamSubmissions[i])
    }


    return (
        <Accordion className="my-0">
            <Accordion.Item eventKey="0" className={lastDisplayed ? '' : "border-bottom-0"}>
                <Accordion.Header>
                    Student Submissions
                </Accordion.Header>
                <Accordion.Body >
                    <Table bordered hover className=''>
                        <thead>
                            <tr>
                                <th>Student Number</th>
                                <th>Student Name</th>
                                <th>Submitted</th>
                                <th>Agreed Mark</th>
                                <th>Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentExamSubmissions.map((studentExamSubmission, i) =>

                                <tr key={studentExamSubmission.student_exam_submission_id}>
                                    <td>
                                        {studentExamSubmission.student_number}
                                    </td>
                                    <td>
                                        {studentExamSubmission.student_name}
                                    </td>
                                    <td className=''>
                                        {studentExamSubmission.file_system_id ? <BootstrapTick size={20} /> : null}
                                    </td>
                                    <td>
                                        {studentExamSubmission.marker_mark ? studentExamSubmission.marker_mark : '-'}
                                    </td>
                                    <td className='d-flex justify-content-center'>
                                        <LinkContainer to={`${location.pathname}/student_exam_submission/${studentExamSubmission.student_exam_submission_id}`}>
                                            <Button className='my-1 me-1'>
                                                View
                                            </Button>
                                        </LinkContainer>
                                        <Button className='my-1' variant='warning' onClick={()=>{handleStudentRemoveClick(i)}}>
                                            Remove
                                        </Button>

                                    </td>
                                </tr>
                            )}
                            <div className=' my-2'>
                                <p>Add a student:</p>
                            </div>


                        </tbody>

                    </Table>


                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}



export default StudentsInExamAccordion