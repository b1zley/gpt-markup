
import SelectUGPanel from "./SelectUGPanel"
import { useState } from "react"
import UGSESControls from "./UGSESDeps/UGSESControls"
import UGSESInteractingWithSES from "./UGSESDeps/UGSESInteractingWithSES"

const UGStudentExamSubmission = () => {

    const examPanelNameArray = [
        'General Controls',
        'Interacting with the Student Exam Submission'
    ]

    const orderedComponentArray = [
        UGSESControls,
        UGSESInteractingWithSES
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

export default UGStudentExamSubmission