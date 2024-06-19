import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'
import BootstrapTick from '../../../icons/BootstrapTick'

import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'

const StudentExamSubmissionsTable = ({examInformation, studentExamSubmissions, setStudentExamSubmissions}) => {

    async function handleStudentRemoveClick(i) {
        const submissionToDelete = studentExamSubmissions[i]
        const apiDeleteExamSubmissionUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${submissionToDelete.exam_id}/student_exam_submission/${submissionToDelete.student_exam_submission_id}`
        const deleteExamSubmissionResponse = await axiosToBackend.delete(apiDeleteExamSubmissionUrl)
        if (deleteExamSubmissionResponse.status === 204) {
            let newExamSubmissionsArray = studentExamSubmissions.filter((_, index) => index !== i)
            setStudentExamSubmissions(newExamSubmissionsArray)
        } else {
            window.alert('Failed to remove student')
        }

    }

    return(
        <Table responsive bordered hover className=''>
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
                            {studentExamSubmissions.length === 0 ?
                            <tr>
                                <td colSpan={12} className='text-center'>
                                    No students added yet...
                                </td>
                            </tr>
                            : null}


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
                                    <td >
                                        <div className='d-flex justify-content-center'>
                                            <LinkContainer to={`${location.pathname}/student_exam_submission/${studentExamSubmission.student_exam_submission_id}`}>
                                                <Button className='my-1 me-1'>
                                                    View
                                                </Button>
                                            </LinkContainer>
                                            <Button className='my-1' variant='warning' onClick={() => { handleStudentRemoveClick(i) }}>
                                                Remove
                                            </Button>
                                        </div>

                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </Table>
    )


}


export default StudentExamSubmissionsTable