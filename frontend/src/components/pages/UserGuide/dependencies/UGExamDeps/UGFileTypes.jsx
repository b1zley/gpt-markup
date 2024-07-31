
import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"


const UGFileTypes = () => {
    const contentList = [

        {
            title: 'Function',
            body: (
                <>
                    <div>The purpose of this component is to indicate to the software system which file types from student exam submissions and the model answer should be parsed and sent to the LLM for evaluation. </div>
                </>
            )
        },
        {
            title: 'Managing File Types',
            body: (
                <>
                    <div>To navigate to File Types:</div>
                    <li>Navigate to the Exam of interest.</li>
                    <li>Click on the 'File Types' navigation button.</li>

                </>
            )
        },
        {
            title: 'Editing Desired File Types',
            body: (
                <>
                    <div>
                        To toggle file types to be parsed by the LLM:
                    </div>
                    <li>Navigate to the File Types section.</li>
                    <li>Find the file type you wish to toggle in the list.</li>
                    <li>Click the toggle button to toggle active vs inactive.</li>
                    <li>When the button is coloured blue, it indicates that the file type will be parsed.</li>
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

export default UGFileTypes