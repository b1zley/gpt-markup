import Accordion from 'react-bootstrap/Accordion'


const StudentsInExamAccordion = ({ lastDisplayed }) => {

    console.log('hello from StudentsInExamAccordion')

    return (
        <Accordion className="my-0">
            <Accordion.Item eventKey="0" className={lastDisplayed ? '' :"border-bottom-0"}>
                <Accordion.Header>
                    Student Submissions
                </Accordion.Header>
                <Accordion.Body className="d-flex">


                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}



export default StudentsInExamAccordion