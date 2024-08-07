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
import useConfirmation from "../../../hooks/useConfirmation"



/**
 * A component that displays an accordion for locking/unlocking an exam and verifying its readiness.
 * The component checks the status of various exam parameters and allows for locking the exam if all criteria are met.
 * 
 * @component
 * @example
 * ```jsx
 * const examInformation = {
 *   exam_question: "Develop a software system to solve some problem.",
 *   fileTypes: [{ allowed: true, name: "java" }],
 *   rubric: [{ rubric_component_id: 1, name: "Introduction", rating_ranges: [], maximum: 10 }],
 *   prompt_specifications: "You are a marker in a university level examination.",
 *   file_system_id: 12345,
 *   is_locked: false,
 *   module_id: 1,
 *   exam_id: 1
 * };
 * 
 * const setExamInformation = (info) => { console.log(info) };
 * 
 * <LockExamAccordion examInformation={examInformation} setExamInformation={setExamInformation} />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.examInformation - The current information about the exam, including its question, file types, rubric, prompt specifications, and other relevant data.
 * @param {Function} props.setExamInformation - A function to update the exam information state.
 * 
 * @returns {React.Element} The rendered accordion component.
 */
const LockExamAccordion = ({ examInformation, setExamInformation }) => {
    console.log('this is some exam information')
    console.log(examInformation)

    const tableHeaders = ['Parameter', 'Values', 'Ready']

    const [studentExamSubmissions, setStudentExamSubmissions] = useState([])
    const [markedForTraining, setMarkedForTraining] = useState([])
    const [isChecked, setIsChecked] = useState(!!examInformation.is_locked)


    const [confirm, ConfirmationModal] = useConfirmation()

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
            await confirm('Failed to update exam lock')
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


            <ConfirmationModal />
        </Accordion>
    )

}


export default LockExamAccordion