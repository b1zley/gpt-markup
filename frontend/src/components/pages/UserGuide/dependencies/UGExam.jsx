
import { useState } from 'react'
import SelectUGPanel from './SelectUGPanel'
import UGExamControls from './UGExamDeps/UGExamControls'
import UGExamQuestion from './UGExamDeps/UGExamQuestion'
import UGFileTypes from './UGExamDeps/UGFileTypes'
import UGRubric from './UGExamDeps/UGRubric'
import UGAIOptions from './UGExamDeps/UGAIOptions'
import UGModelAnswer from './UGExamDeps/UGModelAnswer'
import UGEngagedSuperUsers from './UGExamDeps/UGEngagedSuperUsers'
import UGStudentSubmissions from './UGExamDeps/UGStudentSubmissions'
import UGChecklist from './UGExamDeps/UGChecklist'

const UGExam = () => {


    const examPanelNameArray = [
        'Exam Controls',
        'Checklist',
        'Exam Question',
        'File Types',
        'Rubric',
        'AI Options',
        'Model Answer',
        'Engaged SuperUsers',
        'Student Submissions'
    ]

    const [examPanelSelection, setExamPanelSelection] = useState(examPanelNameArray.map((name, i) => i === 0 ? true : false))

    const orderedComponentArray = [
        UGExamControls,
        UGChecklist,
        UGExamQuestion,
        UGFileTypes,
        UGRubric,
        UGAIOptions,
        UGModelAnswer,
        UGEngagedSuperUsers,
        UGStudentSubmissions
    ]


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

export default UGExam