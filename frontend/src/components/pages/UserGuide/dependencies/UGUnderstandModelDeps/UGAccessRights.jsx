
import { Container } from "react-bootstrap"
import UGContentDisplay from "../UGExamDeps/UGContentDisplay"


const UGAccessRights = () => {

    const contentList = [
        {
            title: 'Prior Note', 
            body: (
                <>
                    <div>This application is currently work in progress, so as a result, the only implemented SuperUser role is Administrator. Further implementations of the Marker type and Lecturer type would be necessary to implement in the event the application was ever deployed. Already implemented is the ability to add Lecturers and Markers access rights to Modules and Exams, however the specific frontend and backend implementations of these User Roles are Work In Progress. </div>
                </>
            )
        },
        {
            title:'Administrator',
            body:(
                <>
                    <div>The Administrator SuperUser type has access to all Modules and all Exams within the application. They have read and write access to all components and are included by default in all Engaged SuperUser fields within each component.</div>
                </>
            )
        },
        {
            title: 'Lecturer',
            body:(
                <>
                    <div>The Lecturer SuperUser type is granted specific access to Modules by an Administrator. When a Lecturer gains access to a Module the Lecturer has implicit access to all Exams within this module. Lecturers have both read and write access.</div>
                </>
            )  
        },
        {
            title: 'Marker',
            body:(
                <>
                    <div>The Marker SuperUser type is granted specific access to Exams by a Lecturer or Administrator. When a Marker is given access to an Exam, they have read-only access to the Exam's properties, and have read and write access to the Student Exam Submissions within the Exam.</div>
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

export default UGAccessRights