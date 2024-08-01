
import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"

const UGEngagedSuperUsers = () => {

    const contentList = [
        {
            title: 'Function',
            body: (
                <>
                    <div>The purpose of the Engaged SuperUsers section of the Exam is to provide an easy indication of all SuperUsers who have access to a given Exam. This will include all university administrators, any lecturers who have been given access to the Module the Exam is contained within, and any markers who have been given direct access to the Exam.</div>
                </>
            )
        },
        {
            title: 'Managing Engaged SuperUsers',
            body: (
                <>
                    <div>To navigate to the Engaged SuperUsers section:</div>
                    <li>Navigate to the Exam of interest.</li>
                    <li>Click on the 'Engaged SuperUsers' navigation button.</li>
                </>
            )
        },
        {
            title: 'Adding a new Marker',
            body: (
                <>
                    <div>To add a new marker:</div>
                    <li>Navigate to the Engaged SuperUsers section of the Exam of interest.</li>
                    <li>Scroll to the 'Add a new marker...' section.</li>
                    <li>Select the marker you wish to add from the dropdown.</li>
                    <li>Click the 'Add New Marker' button.</li>
                    <li>The exam will be successfully updated with the new marker.</li>
                </>
            )
        },
        {
            title: 'Removing a Marker',
            body: (
                <>
                    <div>To remove a Marker:</div>
                    <li>Navigate to the Engaged SuperUsers section of the Exam of interest.</li>
                    <li>Scroll to the Engaged SuperUsers list.</li>
                    <li>Find the Marker you wish to remove access from.</li>
                    <li>Click the corresponding 'Remove Access' button.</li>
                    <li>The Exam will be successfully updated, removing this marker.</li>

                </>
            )
        },
        {
            title: 'Managing lecturer access to Exams',
            body: (
                <>
                    <div>To manage which lecturers can access an Exam, refer to Module &gt; Assigning Lecturers to a Module.</div>
                </>
            )
        },
    ]

    return(
        <>
            <Container className="my-3">

                <UGContentDisplay
                    contentList={contentList}
                />

            </Container>
        </>
    )

}

export default UGEngagedSuperUsers