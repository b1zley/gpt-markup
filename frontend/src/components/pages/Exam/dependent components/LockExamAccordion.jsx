import { Accordion } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import TableRowExamQuestion from "./LockExamAccordionDeps/TableRowExamQuestion"
import FileTypesDisplay from "./LockExamAccordionDeps/FileTypesDisplay"
import RubricComponentsTable from "./RubricComponentsTable"
import MyFileBrowser from "../../MyFileBrowser/MyFileBrowser"
import Form from 'react-bootstrap/Form'

import { useState, useEffect } from 'react'
import BASE_API_URL from "../../../../BASE_API_URL"
import axiosToBackend from "../../../../axiosToBackend"
import StudentExamSubmissionsTable from "./StudentExamSubmissionsTable"

const LockExamAccordion = ({ examInformation, setExamInformation }) => {
    console.log('this is some exam information')
    console.log(examInformation)

    const tableHeaders = ['Parameter', 'Values', 'Ready']

    const [studentExamSubmissions, setStudentExamSubmissions] = useState([])
    const [markedForTraining, setMarkedForTraining] = useState([])
    const [isChecked, setIsChecked] = useState(!!examInformation.is_locked)


    const readyArray = [
        examInformation.exam_question ? true : false,
        examInformation.fileTypes.filter((ft) => ft.allowed).length > 0,
        examInformation.rubric.length > 0,
        examInformation.prompt_specifications,
        examInformation.file_system_id,
        markedForTraining.length > 0
    ]

    function allTrue (truthArray){
        for(const element of truthArray){
            if(!element){
                return false
            }
        }
        return true
    }

    useEffect(() => {

        async function handleStudentExamSubmissionsFetch() {
            // fetch student exam submission from api
            const apiFetchExamSubmissionsUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/student_exam_submission`
            const responseFromFetchExams = await axiosToBackend.get(apiFetchExamSubmissionsUrl)
            const newExamSubmissions = responseFromFetchExams.data
            // handle setting state from response data
            setStudentExamSubmissions(newExamSubmissions)
            // console.log(newExamSubmissions)
            const newMarkedForTraining = newExamSubmissions.filter((ses) => !!ses.marked_for_training)
            setMarkedForTraining(newMarkedForTraining)
            // console.log(newMarkedForTraining)

        }
        handleStudentExamSubmissionsFetch()
    }, [examInformation.exam_id, examInformation.module_id])


    useEffect(() => {

        const newMarkedForTraining = studentExamSubmissions.filter((ses) => !!ses.marked_for_training)
        setMarkedForTraining(newMarkedForTraining)

    }, [studentExamSubmissions])

    async function handleExamLockChange(e) {
        // console.log('change!')
        const checked = !isChecked
        // console.log(checked)
        try {
            const { module_id, exam_id } = examInformation
            const reqBody = {
                is_locked: checked
            }
            const apiUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}`
            const response = await axiosToBackend.put(apiUrl, reqBody)
            setIsChecked(checked)
            let newExamInformation = { ...examInformation }
            newExamInformation.is_locked = checked
            setExamInformation(newExamInformation)
        } catch (err) {
            console.log(err)
            window.alert('Failed to update exam lock')
        }
    }

    return (
        <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    Checklist
                </Accordion.Header>
                <Accordion.Body>
                    <p>
                        For the AI to generate feedback, the following data must be provided:
                    </p>
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {tableHeaders.map((headContent, i) =>
                                        <th key={i}>
                                            {headContent}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                <TableRowExamQuestion
                                    contentTitle={'Exam Question'}
                                    contentToDisplay={<pre>{examInformation.exam_question}</pre>}
                                    ready={examInformation.exam_question ? true : false}
                                    useModal={true}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'File Types'}
                                    contentToDisplay={<FileTypesDisplay fileTypes={examInformation.fileTypes} />}
                                    ready={examInformation.fileTypes.filter((ft) => ft.allowed).length > 0}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Rubric'}
                                    contentToDisplay={<RubricComponentsTable
                                        examInformation={examInformation}
                                        setExamInformation={setExamInformation}
                                        hideControls={true}
                                    />}

                                    ready={examInformation.rubric.length > 0}
                                    useModal={true}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Prompt Specifications'}
                                    contentToDisplay={<pre>{examInformation.prompt_specifications}</pre>}
                                    ready={examInformation.prompt_specifications}
                                    useModal={true}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Model Answer'}
                                    contentToDisplay={<MyFileBrowser basePath={`EXAM_MODEL_ANSWERx--xextractedx--x${examInformation.file_system_id}`} />}
                                    ready={examInformation.file_system_id}
                                    useModal={true}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Example Submissions'}
                                    contentToDisplay={<StudentExamSubmissionsTable
                                        examInformation={examInformation}
                                        setExamInformation={setExamInformation}
                                        studentExamSubmissions={markedForTraining}
                                        setStudentExamSubmissions={setMarkedForTraining}
                                        hideControls={true}
                                    />}
                                    ready={markedForTraining.length > 0}
                                    useModal={true}
                                />
                            </tbody>
                        </Table>
                    </div>
                    <hr className="divider" />
                    <p>
                        Once all parameters have been marked as ready, the Exam can be marked as ready, and AI generation can take place (note: while an exam is marked as ready it can&apos;t be edited):
                    </p>


                    {allTrue(readyArray) ?
                        <Form >
                            <Form.Check onChange={(e) => handleExamLockChange(e)} // prettier-ignore
                                type="switch"
                                id="custom-switch"
                                label="Mark Ready"
                                checked={isChecked}
                            />
                        </Form>

                        :
                        <>
                            <p>
                                All parameters not ready!
                            </p>
                            <Form >
                                <Form.Check  // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label="Lock Exam"
                                    checked={isChecked}
                                    disabled
                                />
                            </Form>
                        </>


                    }

                </Accordion.Body>


            </Accordion.Item>



        </Accordion>
    )

}


export default LockExamAccordion