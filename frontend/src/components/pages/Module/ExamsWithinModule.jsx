import { Col, ListGroup, Row, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

import BASE_API_URL from "../../../BASE_API_URL"
import axiosToBackend from '../../../axiosToBackend'

import useConfirmation from "../../hooks/useConfirmation"

const ExamsWithinModule = ({ module_id, examsWithinModule, setExamsWithinModule }) => {
    const [confirm, ConfirmationModal] = useConfirmation()

    const DeleteExamConfirmModal = ({exam}) => {


        return (
            <>  
                <div>
                    Are you sure you want to delete the exam:
                </div>
                <strong>
                    {exam.exam_name}
                </strong>
                <div>
                    This action is irreversible!
                </div>
            </>
        )
    }

    const handleDeleteExam = async (event, exam) => {
        const confirmation = await confirm(<DeleteExamConfirmModal exam={exam} /> )
        if(!confirmation){
            return
        }

        event.preventDefault(); // Prevent the default action of the event
        event.stopPropagation(); // Stop the event from propagating further


        const examIdToDelete = exam.exam_id
        const moduleIdToDeleteFrom = module_id
        const apiDeleteUrl = `${BASE_API_URL}module/${moduleIdToDeleteFrom}/exam/${examIdToDelete}`

        console.log(apiDeleteUrl)
        try {
            const responseFromDelete = await axiosToBackend.delete(apiDeleteUrl)
            if (responseFromDelete.status != 204) {
                throw new Error()
            }
            const indexToRemove = examsWithinModule.findIndex(element => element.exam_id === examIdToDelete)
            const newArray = examsWithinModule.slice(0, indexToRemove).concat(examsWithinModule.slice(indexToRemove + 1));
            console.log(responseFromDelete)
            setExamsWithinModule(newArray)
        } catch (err) {
            window.alert('Failed to remove')
        }


    }


    return (
        <>
            <h4>
                Exams
            </h4>
            <ListGroup>
                {examsWithinModule.map((exam) =>
                    <ListGroup.Item key={`${module_id}-${exam.exam_id}`}>
                        <Row>
                            <Col xs={3} className="d-flex align-items-center">
                                <Link to={`/module/${module_id}/exam/${exam.exam_id}`} className="text-dark" style={{ textDecoration: 'none' }}>{exam.exam_name}</Link>
                            </Col>
                            <Col xs={6}>
                            </Col>
                            <Col xs={3}>
                                <Button variant="warning" onClick={(event) => handleDeleteExam(event, exam)} >
                                    Delete
                                </Button>

                            </Col>
                        </Row>
                    </ListGroup.Item>
                )}

            </ListGroup>
            <ConfirmationModal /> 
        </>
    )
}


export default ExamsWithinModule