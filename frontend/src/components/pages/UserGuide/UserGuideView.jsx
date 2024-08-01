
import Container from 'react-bootstrap/Container'
import { useState } from 'react'
import UGModule from './dependencies/UGModule'
import SelectUGPanel from './dependencies/SelectUGPanel'
import UGExam from './dependencies/UGExam'
import UGStudentExamSubmission from './dependencies/UGStudentExamSubmission'
import UGAIGeneration from './dependencies/UGAIGeneration'
import UGUnderstandModel from './dependencies/UGUnderstandModel'

const UserGuideView = () => {

    const [panelSelection, setPanelSelection] = useState([true, false, false, false, false])
    const panelSelectionNameArray = ['Understanding the Model','Module', 'Exam', 'Student Exam Submission', 'AI Generation Full Journey']

    return (
        <>
            <Container>
                <h1>
                    User Guide
                </h1>
                <SelectUGPanel
                    panelSelection={panelSelection}
                    setPanelSelection={setPanelSelection}
                    panelSelectionNameArray={panelSelectionNameArray}
                />
                {panelSelection[0] ? <UGUnderstandModel /> : null }
                {panelSelection[1]  ? <UGModule /> : null}
                {panelSelection[2]  ? <UGExam /> : null}
                {panelSelection[3]  ? <UGStudentExamSubmission /> : null}
                {panelSelection[4]  ? <UGAIGeneration /> : null}

            </Container>
        </>
    )

}


export default UserGuideView