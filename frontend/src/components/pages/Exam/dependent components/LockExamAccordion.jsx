import { Accordion } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import TableRowExamQuestion from "./LockExamAccordionDeps/TableRowExamQuestion"
import FileTypesDisplay from "./LockExamAccordionDeps/FileTypesDisplay"


const LockExamAccordion = ({examInformation, setExamInformation}) => {
    console.log('this is some exam information')
    console.log(examInformation)

    const tableHeaders = ['Parameter', 'Values', 'Ready']


    return (
        <Accordion defaultActiveKey="0" >
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    Exam Lock
                </Accordion.Header>

                <Accordion.Body>
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
                                    ready={examInformation.fileTypes.filter((ft)=> ft.allowed).length > 0}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Rubric'}
                                    contentToDisplay={'hello'}
                                    ready={true}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Prompt Specifications'}
                                    contentToDisplay={'hello'}
                                    ready={true}
                                />
                                <TableRowExamQuestion
                                    contentTitle={'Model Answer'}
                                    contentToDisplay={'hello'}
                                    ready={true}
                                />
                            </tbody>
                        </Table>
                    </div>
                </Accordion.Body>


            </Accordion.Item>



        </Accordion>
    )

}


export default LockExamAccordion