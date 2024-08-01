
import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"

const UGModelAnswer = () => {


    const contentList = [
        {
            title: 'Function',
            body: (
                <>
                    <div>The purpose of the Model Answer component is to provide to the LLM an example of what a 'perfect' answer to the Exam Question and Rubric would look like. This is useful as it provides a benchmark to compare student exam submissions against. This is not only useful for the LLM's marking generation, but is also useful to human markers who may use this service.</div>
                </>
            )
        },
        {
            title: 'Managing the Model Answer',
            body: (
                <>
                    <div>To navigate to the Model Answer section:</div>
                    <li>Navigate to the Exam of interest.</li>
                    <li>Click on the 'Model Answer' button on the navigation bar.</li>
                </>
            )
        },
        {
            title: 'Uploading a new Model Answer',
            body: (
                <>
                    <div>To upload a new Model Answer:</div>
                    <li>Navigate to the Model Answer section of the Exam of interest.</li>
                    <li>Click on 'Choose file'.</li>
                    <li>This will open a dialog box to select a file to upload.</li>
                    <li>Choose the .zip file which contains the Model Answer you want to upload.</li>
                    <li>Click 'Upload New'.</li>
                    <li>This will cause the Exam to be updated with the chosen Model Answer.</li>
                    <div>NOTE: Only a .zip file of the Model Answer can be used.</div>
                    <div>NOTE: File Types should be selected prior to uploading a Model Answer, please refer to the File Types section of the user guide for details.</div>
                </>
            )
        },
        {
            title: 'Examining an uploaded Model Answer using the in-built File Browser',
            body: (
                <>
                    <div>To view an uploaded Model Answer:</div>
                    <li>Navigate to the Model Answer section of the Exam of interest.</li>
                    <li>Click on 'Display Project Files'.</li>
                    <li>This will cause a modal to pop out which allows you to browse the unzipped Model Answer files.</li>
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
            title: 'Downloading an uploaded Model Answer',
            body: (
                <>
                    <div>To download an uploaded Model Answer:</div>
                    <li>Navigate to the Model Answer section of the Exam of interest.</li>
                    <li>Click on the 'Download' button.</li>
                    <li>This will cause a dialog box to appear, enter the directory and file name you wish to save the Model Answer zip file as.</li>
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

export default UGModelAnswer