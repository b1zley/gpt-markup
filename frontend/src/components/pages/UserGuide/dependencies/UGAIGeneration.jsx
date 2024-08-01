
import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGExamDeps/UGContentDisplay"
const UGAIGeneration = () => {

    const contentList = [
        {
            title: 'Generating AI Critique',
            body: (
                <>
                    <div>Generating AI Critique is a complex, multi-step process, which requires a large quantity of data to be gathered from the user.
                        This guide will aim to guide the user through each step of this process, referring to other parts of the user guide for specific information.

                    </div>

                    <li>
                        <strong>Create the Exam </strong>- Refer to Module &gt; Creating a new Module and Exam &gt; Exam Controls &gt; Creating an Exam.
                    </li>
                    <li>
                        <strong>Navigate to the Exam</strong> - Refer to Exam &gt; Exam Controls &gt; Viewing an Exam.
                    </li>
                    <li>
                        <strong>Add the Exam Question</strong> - Refer to Exam &gt; Exam Question &gt; Adding an exam question.
                    </li>
                    <li>
                        <strong>Add desired File Types</strong> - Refer to Exam &gt; File Types &gt; Editing Desired File Types.
                    </li>
                    <li>
                        <strong>Add Rubric Components</strong> - Refer to Exam &gt; Rubric &gt; Adding Rubric Components.
                    </li>
                    <li>
                        <strong>Add Prompt Specifications</strong> - Refer to Exam &gt; AI Options &gt; Adding Prompt Specifications.
                    </li>
                    <li>
                        <strong>Upload a Model Answer</strong> - Refer to Exam &gt; Model Answer &gt; Uploading a new Model Answer.
                    </li>
                    <li>
                        <strong>Add desired students to Exam</strong> - Refer to Student Exam Submission &gt; General Controls &gt; Adding a student to an Exam.
                    </li>
                    <li>
                        <strong>Complete upload and marking for atleast 1 student</strong> - Refer to:
                        <ul>
                            <li>
                                Student Exam Submission &gt; General Controls &gt; Marking a student submission for AI Training
                            </li>
                            <li>
                                Student Exam Submission &gt; Interacting with the Student Exam Submission &gt; Uploading an answer for a Student Exam Submission
                            </li>
                            <li>
                                Student Exam Submission &gt; Interacting with the Student Exam Submission &gt; Adding/Modifying Critique and Marks
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Lock the Exam</strong> - Refer to Exam &gt; Checklist &gt; Lock Exam.
                    </li>
                    <li>
                        <strong>Complete upload for student submission you wish to generate AI Critique for</strong> - Refer to Student Exam Submission &gt; Interacting with the Student Exam Submission &gt; Uploading an answer for a Student Exam Submission.
                    </li>
                    <li>
                        <strong>Generate AI Critique</strong> - Refer to Student Exam Submission &gt; Interacting with the Student Exam Submission &gt; Generating AI Critique.
                    </li>


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

export default UGAIGeneration