
import { Container } from "react-bootstrap"
import UGContentDisplay from "./UGContentDisplay"

const UGStudentSubmissions = () => {

    const contentList = [
        {
            title: 'User Guide Access',
            body: 'For information on Student Submissions, refer to the Student Exam Submission section of this user guide.'
        }
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

export default UGStudentSubmissions