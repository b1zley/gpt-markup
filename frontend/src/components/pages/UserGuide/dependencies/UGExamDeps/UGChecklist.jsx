import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"



const UGChecklist = () => {

    const contentList = [
        {
            title: `Function`,
            body: `The function of the Checklist component is to provide an easily understandable checklist to a user to indicate whether or not the application is able to generate AI critique, and what steps must be taken to allow the system to do so.`
        },
        {
            title: `Parameter - Value - Ready Table`,
            body: `This table provides information to the user on whether different components of the exam are ready for AI Marking.
            If a component is not ready, it is marked with an X in the ready column.
            If a component is ready, it is marked with a tick, and is easily viewable from the value section of the table.
            `
        },
        {
            title: `Lock Exam`,
            body: (
                <>
                    AI Generation cannot take place until an Exam is locked using the 'Lock Exam' toggle.
                    An Exam cannot be locked until all rows in the Checklist table are marked as ready.
                    Once an Exam is locked it cannot be editted until it is unlocked.
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

export default UGChecklist