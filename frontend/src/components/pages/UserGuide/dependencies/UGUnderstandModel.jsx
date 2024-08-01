


import UGDataModel from "./UGUnderstandModelDeps/UGDataModel";
import {useState} from 'react'
import SelectUGPanel from "./SelectUGPanel";
import UGAccessRights from "./UGUnderstandModelDeps/UGAccessRights";

const UGUnderstandModel = () => {

    const examPanelNameArray = [
        'The Data Model',
        'Access Rights'
    ]

    const orderedComponentArray = [
        UGDataModel,
        UGAccessRights
    ]


    const [examPanelSelection, setExamPanelSelection] = useState(examPanelNameArray.map((name, i) => i === 0 ? true : false))

    return (
        <>
            <SelectUGPanel
                panelSelection={examPanelSelection}
                panelSelectionNameArray={examPanelNameArray}
                setPanelSelection={setExamPanelSelection}
                hideTop={true}
            />
            {orderedComponentArray.map((Component, i) =>
                examPanelSelection[i] ? <Component key={i} /> : null
            )}
        </>
    )

}






export default UGUnderstandModel