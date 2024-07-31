import { useEffect } from "react"
import { Accordion, Button, Row, Col, Container } from "react-bootstrap"



/**
 * A component that provides button controls to activate specific accordions.
 * 
 * This component renders a set of buttons where each button corresponds to an accordion section. Clicking a button activates the associated accordion by updating the `activeAccordion` state. Only one accordion can be active at a time.
 * 
 * @component
 * @example
 * ```jsx
 * const [activeAccordion, setActiveAccordion] = useState([1, 0, 0]);
 * const nameArray = ["Section 1", "Section 2", "Section 3"];
 * 
 * <ActiveAccordionControl
 *   activeAccordion={activeAccordion}
 *   setActiveAccordion={setActiveAccordion}
 *   nameArray={nameArray}
 * />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {number[]} props.activeAccordion - An array indicating the active state of each accordion section.
 * @param {Function} props.setActiveAccordion - Function to update the state of active accordions.
 * @param {string[]} props.nameArray - An array of names for each accordion section.
 * 
 * @returns {React.Element} The rendered component with button controls for activating accordions.
 */
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