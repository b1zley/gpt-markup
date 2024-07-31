
import { Container, Row, Col } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"

const UGExamControls = () => {


    const contentList = [
        {
            title: 'Creating an Exam',
            body: `Exams exist within Modules, so first, navigate to the Module you wish to create this Exam within.
                            Scroll to the 'Create Exam' component, and enter the desired Exam name. Then, click the 'Create Exam' button.
                            The Exam will be created within the desired Module, and will be added to the Exams list.`
        },
        {
            title: `Deleting an Exam`,
            body: `Exams exist within Modules, so first, navigate to the Module you wish to delete this Exam from.
                            Find the Exam you wish to delete in the 'Exams' list, and click on the corresponding 'Delete' button.
                            A dialog box will appear asking you to confirm your decision, click 'Confirm' to delete the Exam, and 'Cancel' to cancel.`
        },
        {
            title: `Viewing an Exam`,
            body: `Exams exist within Modules, so first, navigate to the Module you wish to view this Exam in.
                            Find the Exam you wish to view in the 'Exams' list, and click on the corresponding Exam name.`
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

export default UGExamControls