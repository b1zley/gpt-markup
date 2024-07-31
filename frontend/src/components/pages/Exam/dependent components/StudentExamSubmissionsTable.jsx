import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'
import BootstrapTick from '../../../icons/BootstrapTick'

import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'

import useConfirmation from '../../../hooks/useConfirmation'


/**
 * A React component that displays a table of student exam submissions.
 * 
 * This component provides controls for managing student submissions, including 
 * marking submissions for training, and removing submissions. It also handles 
 * routing to detailed views of each student's submission.
 *
 * @component
 * @example
 * ```jsx
 * <StudentExamSubmissionsTable
 *   hideControls={false}
 *   examInformation={examInformation}
 *   studentExamSubmissions={studentExamSubmissions}
 *   setStudentExamSubmissions={setStudentExamSubmissions}
 * />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.hideControls - Flag to determine whether control buttons (remove, mark/unmark for training) are hidden.
 * @param {Object} props.examInformation - Object containing information about the exam, including rubric details.
 * @param {Array} props.studentExamSubmissions - Array of student exam submissions to be displayed in the table.
 * @param {Function} props.setStudentExamSubmissions - Function to update the list of student exam submissions.
 *
 * @returns {React.Element} The rendered component.
 */
const StudentExamSubmissionsTable = ({ hideControls, examInformation, studentExamSubmissions, setStudentExamSubmissions }) => {

    const [confirm, ConfirmationModal] = useConfirmation()

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


    function canSESBeMarkedForTraining(studentExamSubmission) {
        if (getRubricComponentIdsFromSES(studentExamSubmission).length !== examInformation.rubric.length) {
            return false
        }
        if (!studentExamSubmission.file_system_id) {
            return false
        }

        return true
    }

    const RemoveStudentModalBody = ({ submissionToDelete }) => {
        console.log(submissionToDelete)
        return (
            <>
                <div>
                    Are you sure you want to remove the student submission:
                </div>
                    Student Number: <strong> {submissionToDelete.student_number}</strong>
                    <br></br>
                    Student Name: <strong> {submissionToDelete.student_name}</strong>
                <div>
                    This action is irreversible!
                </div>
            </>
        )
    }


    async function handleStudentRemoveClick(e, i) {
        e.stopPropagation()
        const submissionToDelete = studentExamSubmissions[i]
        const confirmation = await confirm(<RemoveStudentModalBody submissionToDelete={submissionToDelete} />)
        if (!confirmation) {
            return
        }
        const apiDeleteExamSubmissionUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${submissionToDelete.exam_id}/student_exam_submission/${submissionToDelete.student_exam_submission_id}`
        const deleteExamSubmissionResponse = await axiosToBackend.delete(apiDeleteExamSubmissionUrl)
        if (deleteExamSubmissionResponse.status === 204) {
            let newExamSubmissionsArray = studentExamSubmissions.filter((_, index) => index !== i)
            setStudentExamSubmissions(newExamSubmissionsArray)
        } else {
            await confirm('Failed to remove student')
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
            await confirm('Failed to mark for training')
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
            await confirm('Failed to unmark for training')
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
            <ConfirmationModal />
        </Table>
    )


}


export default StudentExamSubmissionsTable