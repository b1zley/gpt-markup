import { useEffect } from "react"
import { Accordion, Button, Row, Col, Container } from "react-bootstrap"




const ActiveAccordionControl = ({ activeAccordion, setActiveAccordion, nameArray }) => {


    function handleActiveAccordionSet(index) {
        let newActiveAccordion = activeAccordion.slice(0, activeAccordion.length)
        // reset all to 0
        for (let i = 0; i < newActiveAccordion.length; i++) {
            newActiveAccordion[i] = 0
        }

        // set specific to 1
        newActiveAccordion[index] = 1
        setActiveAccordion(newActiveAccordion)

    }



    const buttonStyle = {
        borderRadius: '0',
        width: `${100 / nameArray.length}%`,
        borderLeft: '0px'

    };

    const buttonStyleFirst = {
        ...buttonStyle,
        borderLeft: null
    }





    return (
        <div className="my-2">
            <Container>
                <Row>
                    {activeAccordion.map((accordion, i) => {



                        return (
                            <Button key={i} style={i === 0 ? buttonStyleFirst : buttonStyle} variant={accordion === 1 ? 'primary' : 'outline-primary'} onClick={() => handleActiveAccordionSet(i)}>
                                {nameArray[i]}
                            </Button>
                        )
                    })}
                </Row>
            </Container>

        </div >
    )



}


export default ActiveAccordionControl