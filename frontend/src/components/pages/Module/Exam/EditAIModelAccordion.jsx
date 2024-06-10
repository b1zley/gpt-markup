import  Accordion  from "react-bootstrap/Accordion"


const EditAiModelAccordion = ({aIModelName, aIModelsToChoose, setExamInformation, examInformation}) =>{



    return(
        <Accordion className="my-0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            AI Model
                        </Accordion.Header>
                        <Accordion.Body>
                        <div>Chosen Model: {aIModelName}</div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
    )

}


export default EditAiModelAccordion