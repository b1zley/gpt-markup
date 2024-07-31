import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"

const UGExamQuestion = () => {

    const contentList = [
        {
            innerHTMLisActive: true,
            title: `Function`,
            body: (
                <div>This component of an Exam represents the total exam question. This should include all information provided to students who are undertaking this examination, excluding any example data such as CSV files.</div>
            )
        },
        {
            innerHTMLisActive: true,
            title: 'Managing the Exam Question',
            body: (
                <>
                    <div>To navigate to the Exam Question:</div>
                    <li>Navigate to the Exam of interest.</li>
                    <li>Click on the 'Exam Question' navigation button.</li>
                </>
            )
        },
        {
            innerHTMLisActive: true,
            title: 'Adding an exam question',
            body: (
                <>
                    <div>This can occur by one of two methods, please refer to the corresponding sections for further information:</div>
                    <li> Manual entry, using the the Edit button. </li>
                    <li> RTF upload using the Upload button.</li>
                </>

            )
        },
        {
            innerHTMLisActive: true,
            title: 'Edit',
            body: (
                <>
                    <div>To add or edit an already added exam question:</div>
                    <li>Click on the 'Edit' button.</li>
                    <li>This will unlock a textarea field where the desired exam question can be entered.</li>
                    <li>Click on the 'Commit' button.</li>
                    <li>This will lock the textarea field and update the exam question.</li>
                    <li>To revert your changes, instead click the 'Revert' button.</li>
                </>
            )
        },
        {
            innerHTMLisActive: true,
            title: 'Upload',
            body: (
                <>
                    <div>
                        To upload an Exam Question:
                    </div>
                    <li>Ensure the text file is in the correct format (.rtf)</li>
                    <li>Click on the 'Upload' button.</li>
                    <li>This causes a dialog box to appear.</li>
                    <li>Within this dialog box, click 'Choose file' and select the file to upload.</li>
                    <li>Click the 'Upload New' button.</li>
                    <li>The RTF file will be uploaded, and the Exam Question updated, close the dialog box to view.</li>

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

export default UGExamQuestion