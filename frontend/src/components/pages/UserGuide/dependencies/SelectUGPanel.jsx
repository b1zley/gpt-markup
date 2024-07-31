import { Button } from "react-bootstrap"


const SelectUGPanel = ({panelSelection, panelSelectionNameArray, setPanelSelection, hideTop}) => {

    let buttonStyle = {
        borderRadius: '0',
        width: `${100 / panelSelectionNameArray.length}%`,
        height: `60px`,
        borderLeft: '0px'
    };

    hideTop ? buttonStyle = {...buttonStyle, borderTop: '0px'} : null

    const buttonStyleFirst = {
        ...buttonStyle,
        borderLeft: null
    }

    function handleActiveAccordionSet(i){
        console.log('click')
        let newPanelSelection = []
        panelSelection.forEach((panelSelection) => {
            newPanelSelection.push(false)
        })
        newPanelSelection[i] = true
        setPanelSelection(newPanelSelection)
    }


    return (
        <>
            {panelSelectionNameArray.map((penalSelectionName, i) => 

                
                <Button key={i} style={i === 0 ? buttonStyleFirst : buttonStyle} variant={panelSelection[i] ? 'primary' : 'outline-primary'} onClick={() => handleActiveAccordionSet(i)}>
                    {penalSelectionName}
                </Button>

            )}
        </>
    )

}


export default SelectUGPanel