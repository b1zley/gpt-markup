import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'
import BootstrapTick from '../../../icons/BootstrapTick'

import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'

const StudentExamSubmissionsTable = ({ hideControls, examInformation, studentExamSubmissions, setStudentExamSubmissions }) => {


    console.log(studentExamSubmissions)
    // console.log(examInformation.rubric)

    // const rubricLength = examInformation.rubric.length
    // console.log(rubricLength)

    // console.log(getRubricComponentIdsFromSES(studentExamSubmissions[0]))




    function getRubricComponentIdsFromSES(studentExamSubmission) {
        const sesKeyList = Object.keys(studentExamSubmission)
        let rubricComponentsPresentInSES = []
        for (const key of sesKeyList) {
            if (key.includes(`rubric_component_`) && studentExamSubmission[key] !== null) {
                const rcId = key.substring(17, key.length)
                rubricComponentsPresentInSES.push(rcId)
            }
        }
        return rubricComponentsPresentInSES
    }


    function canSESBeMarkedForTraining(studentExamSubmission){
        if(getRubricComponentIdsFromSES(studentExamSubmission).length !== examInformation.rubric.length){
            return false
        }
        if(!studentExamSubmission.file_system_id ){
            return false
        }

        return true
    }


    async function handleStudentRemoveClick(e, i) {
        e.stopPropagation()
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


    async function handleStudentMarkForTrainingClick(e, i) {
        try {
            e.stopPropagation()
            // handle request to backend
            const submissionForTraining = studentExamSubmissions[i]
            const { module_id, exam_id } = examInformation
            const { student_exam_submission_id } = submissionForTraining
            const apiUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}/marked_for_training`
            const response = await axiosToBackend.put(apiUrl)
            // handle update render
            let newStudentSubmission = { ...studentExamSubmissions[i] }
            newStudentSubmission.marked_for_training = 1
            let newStudentExamSubmissions = studentExamSubmissions.splice(0, studentExamSubmissions.length)
            newStudentExamSubmissions[i] = newStudentSubmission
            setStudentExamSubmissions(newStudentExamSubmissions)
        } catch (err) {
            console.log(err)
            window.alert('Failed to mark for training')
        }
    }


    async function handleStudentUnmarkForTrainingClick(e, i) {

        try {
            e.stopPropagation()
            // handle request to backend
            const submissionForTraining = studentExamSubmissions[i]
            const { module_id, exam_id } = examInformation
            const { student_exam_submission_id } = submissionForTraining
            const apiUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}/marked_for_training`
            const response = await axiosToBackend.delete(apiUrl)

            // handle update render
            let newStudentSubmission = { ...studentExamSubmissions[i] }
            newStudentSubmission.marked_for_training = null
            let newStudentExamSubmissions = studentExamSubmissions.splice(0, studentExamSubmissions.length)
            newStudentExamSubmissions[i] = newStudentSubmission
            setStudentExamSubmissions(newStudentExamSubmissions)

        } catch (err) {
            window.alert('Failed to unmark for training')
        }

    }

    return (
        <Table responsive bordered hover className=''>
            <thead>
                <tr>
                    <th>Student Number</th>
                    <th>Student Name</th>
                    <th>Submitted</th>
                    <th>Agreed Mark</th>

                    {hideControls ? null : <th>Controls</th>}

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
                    <LinkContainer key={studentExamSubmission.student_exam_submission_id} to={`${location.pathname}/student_exam_submission/${studentExamSubmission.student_exam_submission_id}`}>

                        <tr >
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

                            {hideControls ? null :
                                <td >
                                    <div className='d-flex justify-content-center'>


                                        <Button className='my-1' variant='warning' onClick={(e) => { handleStudentRemoveClick(e, i) }}>
                                            Remove
                                        </Button>


                                        {
                                            canSESBeMarkedForTraining(studentExamSubmission) ?
                                                studentExamSubmission.marked_for_training ?
                                                    <Button className='my-1 ms-1' variant='success' onClick={(e) => { handleStudentUnmarkForTrainingClick(e, i) }}>
                                                        Unmark for training
                                                    </Button> :
                                                    <Button className='my-1 ms-1' variant='success' onClick={(e) => { handleStudentMarkForTrainingClick(e, i) }}>
                                                        Mark for training
                                                    </Button>


                                                :
                                                <Button className='my-1 ms-1' variant='success' disabled onClick={(e) => { handleStudentMarkForTrainingClick(e, i) }}>
                                                    Missing Submission /Mark
                                                </Button>
                                        }



                                    </div>

                                </td>}


                        </tr>
                    </LinkContainer>

                )}

            </tbody>
        </Table>
    )


}


export default StudentExamSubmissionsTable