
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'

import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import BASE_API_URL from '../../../../../BASE_API_URL';
import Button from 'react-bootstrap/Button';

const AddStudentExamSubmission = ({ examInformation, studentExamSubmissions, setStudentExamSubmissions }) => {

    const [studentNumberToSearchFor, setStudentNumberToSearchFor] = useState(null)

    // students matching search criteria
    const [studentsMatchingSearch, setStudentsMatchingSearch] = useState([])

    // students matching search criteria that do not already appear in student exam submissions
    const [studentsToShow, setStudentsToShow] = useState([])


    async function handleStudentNumberSearchChange(event) {
        const newValue = event.target.value
        setStudentNumberToSearchFor(newValue)

        // handle get request for search
        const apiSearchStudentsURL = `${BASE_API_URL}student/search?student_number_key=${event.target.value}`
        const responseFromSearchGet = await axios.get(apiSearchStudentsURL)
        const newStudentsMatchingSearch = responseFromSearchGet.data
        setStudentsMatchingSearch(newStudentsMatchingSearch)


    }

    // watch student exam submissions and students matching search
    // if either change, we will need to mutate students to show
    useEffect(
        handleExamSubmissionsOrStudentsMatchingSearchChange
        , [studentExamSubmissions, studentsMatchingSearch])

    function handleExamSubmissionsOrStudentsMatchingSearchChange() {
        let newStudentsToShow = studentsMatchingSearch.filter((studentMatchingSearch) => {
            for (let i = 0; i < studentExamSubmissions.length; i++) {
                if (studentExamSubmissions[i].student_id === studentMatchingSearch.student_id) {
                    return false
                }
            }
            return true
        })
        setStudentsToShow(newStudentsToShow)
    }

    async function handleAddStudentClick(student) {
        // post request with student_number
        const postAddStudentToExamSubmissionsApiURL = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/student_exam_submission`
        const postBody = {
            student_id: student.student_id
        }
        const responseFromPostCreateExamSubmission = await axios.post(postAddStudentToExamSubmissionsApiURL, postBody)

        if (responseFromPostCreateExamSubmission.status === 201) {
            const new_student_exam_submission_id = responseFromPostCreateExamSubmission.data.student_exam_submission_id
            // create new studentExamSubmissionObject
            const newStudentExamSubmissionObject = {
                ai_critique_id: null,
                exam_id: examInformation.exam_id,
                exam_submission: null,
                marker_critique: null,
                student_exam_submission_id: new_student_exam_submission_id,
                student_id: student.student_id,
                student_name: student.student_name,
                student_number: student.student_number
            }
            let newStudentExamSubmissions = studentExamSubmissions.slice(0, studentExamSubmissions.length)
            newStudentExamSubmissions.push(newStudentExamSubmissionObject)
            setStudentExamSubmissions(newStudentExamSubmissions)
        } else {
            window.alert('Failed to add student to exam')
        }
    }

    return (

        <Fragment>
            <Form>
                <h5 className="my-2">
                    Add a new student...
                </h5>
                <Form.Group className="my-2" >
                    <Form.Label>Student Number to search for:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        value={studentNumberToSearchFor}
                        onChange={handleStudentNumberSearchChange}
                    />
                </Form.Group>
            </Form>

            <h6>
                Students matching search:
            </h6>
            {studentNumberToSearchFor
                ?
                studentsToShow.length === 0
                    ?
                    'No students matching search key'
                    :
                    <ListGroup>
                        {studentsToShow.map((student) =>
                            <ListGroup.Item
                                key={student.student_id}
                                className='d-flex'
                            >
                                <span>{student.student_number}</span>
                                <span className='ms-4'>{student.student_name}</span>
                                <Button
                                    variant='success'
                                    className='ms-auto'
                                    onClick={() => { handleAddStudentClick(student) }}
                                >
                                    Add Student
                                </Button>
                            </ListGroup.Item>
                        )}

                    </ListGroup>
                :
                'No search term...'

            }




        </Fragment>





    )

}


export default AddStudentExamSubmission