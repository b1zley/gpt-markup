import { Container } from "react-bootstrap"
import UGContentDisplay from "../UGExamDeps/UGContentDisplay"

const UGSESInteractingWithSES = () => {

    const contentList = [
        {
            title: 'Managing the individual Student Exam Submission',
            body: (
                <>
                    <div>To manage the individual student exam submission:</div>
                    <li>Navigate to the Student Submissions section of the Exam of interest.</li>
                    <li>Find the desired Student Submission in the Student Submissions list.</li>
                    <li>Click on this Student Submission.</li>
                    <li>You will be redirected to the individual Student Exam Submission page.</li>
                </>
            )
        },
        { 
            title: 'Uploading an answer for a Student Exam Submission',
            body:(
                <>
                    <div>To upload an individual Student Exam Submission:</div>
                    <li>Navigate to the specific student submission page of interest.</li>
                    <li>Click on the 'Submission Upload' navigation button. </li>
                    <li>Click 'Choose file', this will prompt you to upload a specific file.</li>
                    <li>Click 'Upload New'.</li>
                    <li>This will dynamically update the student exam submission entry with the uploaded file.</li>
                    <div>NOTE: A zip file of the student exam submission must be used.</div>
                </>
            )
        },
        { 
            title: 'Examining an uploaded Submission Answer using the in-built File Browser',
            body:(
                <>
                    <div>To view an uploaded Submission Answer:</div>
                    <li>Navigate to the specific student submission page of interest.</li>
                    <li>Click on the 'Submission Upload' navigation button.</li>
                    <li>Click on 'Display Project Files'.
                    </li>
                    <li>This will cause a modal to pop out which allows you to browse the unzipped Submission Answer files.</li>
                    <li>The modal is divided into three sections:
                        <ol>
                            <li>At the top of the modal is a string which indicates the current position in the Model Answer directory structure.</li>
                            <li>On the left is a navigation bar, clicking on a directory will navigate to that directory, clicking on a file will allow you to view a file.</li>
                            <li>On the right is the currently viewed file, complete with syntax highlighting.</li>
                        </ol>
                    </li>

                </>
            )
        },
        { 
            title: 'Downloading an uploaded Submission Answer',
            body:(
                <>
                    <div>To download an uploaded Submission Answer:</div>
                    <li>Navigate to the specific student submission page of interest.</li>
                    <li>Click on the 'Submission Upload' navigation button.</li>
                    <li>Click on the 'Download' button.</li>
                    <li>This will cause a dialog box to appear, enter the directory and file name you wish to save the Model Answer zip file as.</li>
                </>
            )
        },
        { 
            title: 'Generating AI Critique',
            body:(
                <>
                    <div>To generate AI Critique:</div>
                    <li>Navigate to the specific student submission page of interest.</li>
                    <li>Click the 'Generate AI Critique' button.</li>
                    <li>You will be redirected to the Rubric Marks section and the AI critique will be inserted into the relevant table row for each component.</li>
                    <div>NOTE: To generate AI critique, two conditions must be met:</div>
                    <ol>
                        <li>The Exam must be locked from the Checklist page.</li>
                        <li>A submission answer must be uploaded for this Student Exam Submission.</li>
                    </ol>
                </>
            )
        },
        { 
            title: 'Adding/Modifying Critique and Marks',
            body:(
                <>
                    <div>To add/modify Critique and Marks</div>
                    <li>Navigate to the specific student submission page of interest.</li>
                    <li>Click on the 'Rubric Marks' navigation button.</li>
                    <li>Find the cell you wish to modify in the Rubric marks table.</li>
                    <li>Double-click on this cell to allow editting.</li>
                    <li>Input the desired value.</li>
                    <li>Press enter to confirm the value update.</li>
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

export default UGSESInteractingWithSES