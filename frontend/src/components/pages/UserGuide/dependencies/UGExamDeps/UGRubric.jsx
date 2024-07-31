
import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"
const UGRubric = () => {

    const contentList = [
        {
            title: 'Function',
            body: (
                <>
                    <div>The purpose of this component is to produce an examination rubric by which student exam submissions can be judged. A rubric can be composed of many rubric components (for example, an student's exam submission may be judged on code functionality, but also on code quality).</div>
                    <div>This should include information on the rubric component name, the rubric component description, the max number of points available for the rubric component, and a series of rating ranges within the rubric component.</div>
                    <div>This information is useful to both human and AI examiners, as it provides a framework and marking guideline when evaluating a student submission.</div>
                    <div>A completed rubric should look like this:</div>
                    <div className="mt-2 mb-0" 
                        dangerouslySetInnerHTML={{ 
                            __html: `<div class="table-responsive"><table class="table table-bordered table-hover"><thead><tr><th>Criteria</th><th>Ratings</th><th>Max Points</th></tr></thead><tbody><tr><td><h6>Program Functionality</h6><p>This is the description for program functionality</p></td><td><div class="d-flex justify-content-center"><div class="ms-auto me-auto list-group list-group-horizontal"><div class="list-group-item"><div class="d-flex flex-column"><p><b>5.00</b> to <b>6.00</b></p><p>EXCELLENT</p></div></div><div class="list-group-item"><div class="d-flex flex-column"><p><b>0.00</b> to <b>4.99</b></p><p>BAD</p></div></div></div></div></td><td>6.00</td></tr><tr><td><h6>ANOTHER COMPONENT</h6><p>This is another component desc</p></td><td><div class="d-flex justify-content-center"><div class="ms-auto me-auto list-group list-group-horizontal"><div class="list-group-item"><div class="d-flex flex-column"><p><b>1.00</b> to <b>1.00</b></p><p>GOOD</p></div></div><div class="list-group-item"><div class="d-flex flex-column"><p><b>0.00</b> to <b>0.00</b></p><p>BAD</p></div></div></div></div></td><td>1.00</td></tr></tbody></table></div>`
                        }}
                    />
                </>
            )
        },
        {
            title: 'Managing the Rubric',
            body: (
                <>
                    <div>
                        An Exam Rubric can be managed by:
                    </div>
                    <li>Navigating to the Exam of interest.</li>
                    <li>Clicking on the 'Rubric' navigation button.</li>
                </>
            )
        },
        {
            title: 'Adding Rubric Components',
            body: (
                <>
                    <div>Adding rubric components can be accomplished by one of two methods:</div>
                    <li>Upload Components as CSV.</li>
                    <li>Manual Component Addition.</li>
                    <div>Please refer to the corresponding sections for specific information on each.</div>
                </>
            )
        },
        {
            title: 'Uploading Rubric Components',
            body: (
                <>
                    <div>Rubric Components can be uploaded by:</div>
                    <li>Navigating to the Rubric section of the Exam of interest.</li>
                    <li>Clicking on 'Upload Components as CSV'.</li>
                    <li>This will cause a dialog box to appear. Click 'Choose file', then select a .csv file to upload.</li>
                    <li>Click 'Upload New' to upload the file.</li>
                    <li>This will cause the file to be uploaded, and the rubric to be updated. Close the dialog box to view the uploaded rubric.</li>
                    <div>
                        NOTE: The CSV file must be in the correct format, the required format is outlined below:
                    </div>
                    <div className="mt-2 mb-0" 
                        dangerouslySetInnerHTML={{ 
                            __html: `<table class="table table-striped table-bordered table-hover"><thead><tr><th>Rubric Component Name</th><th>Rubric Component Desc</th><th>Max Points</th><th>Range 1 Desc</th><th>Range 1 Min</th><th>Range 1 Max</th><th>Range 2 Desc</th><th>Range 2 Min</th><th>Range 2 Max</th></tr></thead><tbody><tr><td>Example Component 1</td><td>This is the description for example component 1</td><td>6</td><td>EXCELLENT</td><td>5</td><td>6</td><td>BAD</td><td>0</td><td>4.99</td></tr><tr><td>Example Component 2</td><td>This is the description for example component 2</td><td>1</td><td>GOOD</td><td>1</td><td>1</td><td></td><td></td><td></td></tr></tbody></table>`}}
                    />
                </>
            )
        },
        
        {
            title: 'Manual Rubric Component Addition',
            body: (
                <>
                    <div>To manually add a rubric component:</div>
                    <li>Navigate to the Rubric section of the Exam of interest.</li>
                    <li>Scroll to 'Add a new rubric component...'</li>
                    <li>Enter the name of the desired rubric component in the text box.</li>
                    <li>Click 'Add Component'.</li>
                    <li>This will update the rubric with a naked rubric component, and navigate to the edit page for this rubric component.</li>
                    <li>To edit this rubric component, please refer to 'Editing a Rubric Component'.</li>

                </>
            )
        },
        {
            title: 'Editing a Rubric Component',
            body: (
                <>
                    <div>To edit a rubric component:</div>
                    <li>Navigate to the Rubric section of the Exam of interest.</li>
                    <li>Find the rubric component you wish to edit in the rubric table.</li>
                    <li>Click the corresponding 'Edit' button. This will redirect you to the rubric edit page for this component.</li>
                    <li>In the description section, click 'Edit' to allow direct editing, or 'Upload' to upload an RTF file.</li>
                    <li>In the maximum points section, click 'Edit' to allow direct editing, or 'Upload' to upload an RTF file.</li>
                    <li>For marking ranges interactions, please refer to 'Editing a Marking Range' and 'Adding a Marking Range to a Rubric Component'.</li>
                    <li>The rubric component will be successfully updated, and can be viewed from the Rubric section of the Exam of interest.</li>
                </>
            )
        },
        {
            title: 'Adding a Marking Range to a Rubric Component',
            body: (
                <>
                    <div>To add a new marking range to a rubric component:</div>
                    <li>Navigate to the rubric component you wish to add a marking range to.</li>
                    <li>Click on the 'Add new marking range' button.</li>
                    <li>This will cause a dialog box to appear.</li>
                    <li>Input the Range Description into the corresponding box.</li>
                    <li>Input the Minimum Inclusive Mark into the corresponding box.</li>
                    <li>Input the Maximum Inclusive Mark into the corresponding box.</li>
                    <li>Click 'Submit'.</li>
                    <li>The marking range will dynamically update within the Marking Ranges section, and can also be viewed from the Rubric section of the Exam of interest.</li>
                </>
            )
        },
        {
            title: 'Editting a Marking Range',
            body: (
                <>
                    <div>To edit a marking range:</div>
                    <li>Navigate to the rubric component you wish to edit a marking range within.</li>
                    <li>Scroll to the 'Marking Ranges' section.</li>
                    <li>Find the marking range you wish to edit.</li>
                    <li>Double-click on the cell which contains the value you want to edit.</li>
                    <li>Carry out the desired modifications to that cell.</li>
                    <li>Either click away from the cell, or press the enter key to commit your changes.</li>
                </>
            )
        },
        {
            title: 'Removing a Marking Range',
            body: (
                <>
                    <div>To remove a Marking Range from a rubric component:</div>
                    <li>Navigate to the rubric component you wish to remove a marking range from.</li>
                    <li>Scroll to the 'Marking Ranges' section.</li>
                    <li>Find the marking range you wish to remove.</li>
                    <li>Click on the corresponding 'Remove' button.</li>
                    <li>This will cause a dialog box to appear, click 'Confirm' to confirm removal or 'Cancel' to cancel removal.</li>
                    <li>This will dynamically udpate the rubric component to no longer include this marking range.</li>
                </>
            )
        },
        
        {
            title: 'Removing a Rubric Component',
            body: (
                <>
                    <div>To remove a Rubric Component from a Rubric:</div>
                    <li>Navigate to the Rubric section of the Exam of interest.</li>
                    <li>Find the Rubric Component you wish to remove in the rubric table.</li>
                    <li>Click on the 'Remove' button.</li>
                    <li>This will cause a dialog box to appear, click 'Confirm' to confirm removal or 'Cancel' to cancel removal.</li>
                    <li>This will dynamically update the rubric to no longer include this rubric component.</li>
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

export default UGRubric