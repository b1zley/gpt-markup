

import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"

const UGAIOptions = () => {

    const contentList = [
        {
            title: 'Function',
            body: (
                <>
                    <div>The purpose of the AI Options component is to grant access to users manipulate AI options associated with how the LLM generates feedback.</div>
                    <div><strong>Prompt Specifications</strong> allows the user to append information to the system message which sets the context for the LLM in its generation.
                        This should include information on the type of exam it is marking, the role it should assume, and any prior assumptions it should make regarding the expected skill level of students.</div>
                    <div><strong>Advanced AI Options</strong> allows the user to effect the randomness associated with the LLM generation.
                        While experiments conducted have optimized the LLM generation for consistency across outputs, and a default configuration has been set, it is also reasonable to provide this control to the user.
                    </div>
                </>
            )
        },
        {
            title: 'Managing AI Options',
            body: (
                <>
                    <div>To manage AI Options:</div>
                    <li>Navigate to the exam of interest.</li>
                    <li>Click on the 'AI Options' navigation button.</li>
                </>
            )
        },
        {
            title: 'Adding Prompt Specifications',
            body: (
                <>
                    <div>Adding prompt specifications can be accomplished by two methods:</div>
                    <li>Manual Input using Edit</li>
                    <li>Upload of RTF file using Upload</li>
                    <div>For specific information, please refer to the corresponding section of this guide.</div>
                </>
            )
        },
        {
            title: 'Editing Prompt Specifications',
            body: (
                <>
                    <div>To manually edit/input prompt specifications:</div>
                    <li>Navigate to the AI Options section of the Exam of interest.</li>
                    <li>Click on the 'Edit' button.</li>
                    <li>This will unlock a textarea field where the desired prompt specifications can be entered.</li>
                    <li>Click on the 'Commit' button.</li>
                    <li>This will lock the textarea field and update the prompt specifications.</li>
                    <li>To revert your changes, instead click the 'Revert' button.</li>
                </>
            )
        },
        {
            title: 'Uploading Prompt Specifications',
            body: (
                <>
                    <div>To upload prompt specifications:</div>
                    <li>Ensure the text file is in the correct format (.rtf)</li>
                    <li>Click on the 'Upload' button.</li>
                    <li>This causes a dialog box to appear.</li>
                    <li>Within this dialog box, click 'Choose file' and select the file to upload.</li>
                    <li>Click the 'Upload New' button.</li>
                    <li>The RTF file will be uploaded, and the Exam Question updated, close the dialog box to view.</li>

                </>
            )
        },
        {
            title:'Modifying Advanced AI Options',
            body: (
                <>
                    <div>
                        To change the probability mode between temperature and top_p:
                    </div>
                    <li>Click the toggle button.</li>
                    
                    <div>To change the probability or top_p value:</div>
                    <li>Toggle the token selection mode to the desired type.</li>
                    <li>This unlocks the numeric input field.</li>
                    <li>Update the numeric input field with your desired value.</li>
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

export default UGAIOptions