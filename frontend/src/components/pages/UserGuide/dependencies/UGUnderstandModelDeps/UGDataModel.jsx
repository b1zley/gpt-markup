

import { Container } from "react-bootstrap"
import UGContentDisplay from "../UGExamDeps/UGContentDisplay"
import basicERD from '../../../../../assets/img/lucidBasicDataModelDiagram.png'



const UGDataModel = () => {


    const basicERDStyle = {
        height: '400px'
    }
    const contentList = [
        {
            title: 'The Data Model',
            body: (
                <>
                    <div>
                        In this application, the Assesment system is modelled in the following way:
                    </div>
                    <div>
                        A University will have Modules, each Module can have many Exams, each Exam will have multiple parameters, including its Rubric. Each Rubric will comprise Rubric Components and each Rubric Component can include multiple Marking Ranges.
                    </div>
                    <div>
                        A Student can be enrolled in an Exam, which will produce a new Student Exam Submission.
                    </div>
                    <div>
                        Each Student Exam Submission will have marks and critique for each Rubric Component associated with the Rubric which is in turn, associated with the Exam.
                    </div>
                    <div>This is all very complicated, so the following diagram has been produced to aid in understanding:</div>
                    <div className="d-flex justify-content-center my-4"><img src={basicERD} style={basicERDStyle} /></div>
                    <div>Here we see that nestled within a Module, is its Exams, and each Exam has a Rubric (with Rubric Components) and Submissions (with critique for each Rubric Component).</div>
                </>
            )
        },
        {
            title: 'The Module',
            body: (
                <>
                    <div>
                        A Module represents a grouping of 1 or many Exams, and may be accessed by Administrators and Lecturers. A Module is denoted by its Module Name.
                    </div>
                </>
            )
        },

        {
            title: 'The Exam',
            body: (
                <>
                    <div>
                        An Exam represents a specific code-based assessment undertaken by Students. An Exam is comprised of its Name, Question, Model Answer, Prompt Specifications, Student Submissions and Rubric.
                    </div>
                </>
            )
        },
        {
            title: 'The Rubric',
            body: (
                <>
                    <div>
                        A Rubric represents a framework by which AI and human examiners can evaluate a Student Exam Submission. A Rubric is composed of multiple Rubric Components. Each Rubric Component is comprised of its Name, Description, Maximum Score and Marking Ranges. Each Marking Range is comprised of its Description, Minimum Inclusive Mark and Maximum Inclusive Mark.
                    </div>
                </>
            )
        },
        {
            title: 'The Student Exam Submission',
            body: (
                <>
                    <div>
                    A Student Exam Submission represents an individual Student’s submission for an Exam. It is comprised of the Student’s Answer, and, when completed by a SuperUser, the Human Validated and AI generated critique.
                    </div>
                </>
            )
        }
    ]

    return (
        <>
            <Container className="my-3">
                <UGContentDisplay
                    contentList={contentList}
                />
            </Container>
        </>
    )

}

export default UGDataModel