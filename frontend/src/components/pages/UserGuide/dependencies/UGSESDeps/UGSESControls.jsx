
import { Container } from "react-bootstrap"
import UGContentDisplay from "../UGExamDeps/UGContentDisplay"

const UGSESControls = () => {

    const contentList = [
        {
            title: 'Function',
            body:(
                <>
                    <div>The purpose of the Student Submissions section of the Exam is to manage all student exam submissions within an Exam. This means including tools to add new students to an Exam, remove students from an Exam, adding human generated marks and critique, indicating to the software system which student exam submissions should be used as demonstration for the LLM, downloading student results, and generating AI critique.</div>
                </>
            )
        },
        {
            title: 'Managing Student Submissions',
            body:(
                <>
                    <div>To navigate to the Student Submissions section of an Exam of interest:</div>
                    <li>Navigate to the Exam of interest.</li>
                    <li>Click on the 'Student Submissions' navigation button.</li>
                </>
            )
        },
        {
            title: 'Adding a student to an Exam',
            body:(
                <>
                    <div>To add a new student to an Exam:</div>
                    <li>Navigate to the Student Submissions section fo the Exam of interest.</li>
                    <li>Scroll to the 'Add a new student...' section.</li>
                    <li>Type the student number of the student you wish to add into the text box.</li>
                    <li>The 'Students matching search:' list will dynamically update as the search key becomes more specific.</li>
                    <li>Find the student you wish to add in the list.</li>
                    <li>Click the corresponding 'Add Student' button.</li>
                    <li>The student will be dynamically added to the exam.</li>
                </>
            )
        },
        {
            title: 'Removing a student from an Exam',
            body:(
                <>
                    <div>To remove a student from an Exam:</div>
                    <li>Navigate to the Student Submissions section fo the Exam of interest.</li>
                    <li>Find the student you wish to remove from the Exam in the Student Submissions list.</li>
                    <li>Click the corresponding 'Remove' button.</li>
                    <li>This will cause a dialog box to appear, click 'Confirm' to confirm the removal, or click 'Cancel' to cancel the removal.</li>
                    <li>The student submissions list will be dynamically updated with the results of your induced change.</li>

                </>
            )
        },
        {
            title: 'Marking a student submission for AI Training',
            body:(
                <>
                    <div>To mark a student submission for AI training:</div>
                    <li>Navigate to the Student Submissions section fo the Exam of interest.</li>
                    <li>Find the student you wish to mark for training from the Exam in the Student Submissions list.</li>
                    <li>Click the corresponding 'Mark for training' button.</li>
                    <li>The student submission will be used in future AI critique generations.</li>
                    <div>NOTE: To mark a student submission for training, this student submission must be human marked, and have its answer already uploaded.</div>
                </>
            )
        },
        {
            title: 'Unmarking a student submission for AI Training',
            body: (
                <>
                    <div>To unmark a student submission for AI training:</div>
                    <li>Navigate to the Student Submissions section fo the Exam of interest.</li>
                    <li>Find the student you wish to unmark for training from the Exam in the Student Submissions list.</li>
                    <li>Click the corresponding 'Unmark for training' button.</li>
                    <li>The student submission will not be used in future AI critique generations.</li>
                </>
            )
        },
        {
            title: 'Downloading Student Results',
            body: (
                <>
                    <div>To download all student results for an Exam:</div>
                    <li>Navigate to the Student Submissions section fo the Exam of interest.</li>
                    <li>Click on the 'Download student results' button.</li>
                    <li>This will cause a dialog box to appear, prompting you to select where to download the csv file to.</li>

                </>
            )
        },
        
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

export default UGSESControls