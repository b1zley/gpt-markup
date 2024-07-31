
import Accordion from 'react-bootstrap/Accordion'
import { useLocation } from 'react-router-dom'
import RubricComponentsTable from './RubricComponentsTable'
import AddNewRubricComponent from './AddNewRubricComponent'
import UploadRubricComponentsModal from './UploadRubricComponentsModal'


/**
 * A React component that displays an accordion for managing rubric components within an exam.
 * 
 * The component allows users to view, add, and upload rubric components, provided the exam is not locked.
 * 
 * @component
 * @example
 * ```jsx
 * <RubricComponentsView
 *   lastDisplayed={true}
 *   examInformation={examInformation}
 *   setExamInformation={setExamInformation}
 * />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.lastDisplayed - Determines if the accordion item should have the border-bottom removed.
 * @param {Object} props.examInformation - Object containing information about the exam, including rubric details.
 * @param {Function} props.setExamInformation - Function to update the exam information.
 *
 * @returns {React.Element} The rendered component.
 */
const RubricComponentsView = ({ lastDisplayed, examInformation, setExamInformation }) => {
    console.log(examInformation.rubric)
    const location = useLocation()
    console.log('exam information from rcv:', examInformation)



    return (
        <Accordion className="my-0 " defaultActiveKey="0">
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>Rubric</Accordion.Header>
                <Accordion.Body>
                    <RubricComponentsTable
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                    />
                    <hr className='divider' />

                    {examInformation.is_locked ?
                        'Unlock this exam in checklist to modify the rubric'
                        :
                        <>
                            <UploadRubricComponentsModal
                                examInformation={examInformation}
                                setExamInformation={setExamInformation}
                            />
                            <AddNewRubricComponent
                                examInformation={examInformation}
                                setExamInformation={setExamInformation}
                            />
                        </>


                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}


export default RubricComponentsView