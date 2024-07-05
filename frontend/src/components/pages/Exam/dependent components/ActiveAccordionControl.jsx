import { useEffect } from "react"
import { Accordion, Button } from "react-bootstrap"




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

    return (
        <div className="my-2">
            <div className="d-flex" style={{ width: '150px' }}>
                {activeAccordion.map((accordion, i) => {
                    return (
                        <Button key={i} variant={accordion === 1 ? 'primary' : 'outline-primary'} onClick={() => handleActiveAccordionSet(i)}> {nameArray[i]}</Button>
                    )
                } )}
            </div>
        </div>
    )



}


export default ActiveAccordionControl