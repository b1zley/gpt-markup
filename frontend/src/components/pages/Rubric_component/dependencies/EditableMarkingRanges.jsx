
import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import MarkingRangeTableRow from './MarkingRangeTableRow'
import MarkingRangeTable from './MarkingRangeTable'
import AddNewMarkingRangeButton from './AddNewMarkingRangeButton'
import AddNewMarkingRangeModalButton from './AddNewMarkingRangeModalButton'


/**
 * `EditableMarkingRanges` is a React component that provides a section for displaying and managing marking ranges in an accordion format.
 * 
 * This component displays marking ranges in a table within an accordion. Users can double-click cells to edit values and use buttons to add new marking ranges.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.lastDisplayed - Flag indicating if this is the last item displayed in the accordion
 * @param {Object} props.rubricComponent - The rubric component containing the marking ranges
 * @param {Function} props.setRubricComponent - Function to update the rubric component state
 * @example
 * <EditableMarkingRanges
 *   lastDisplayed={true}
 *   rubricComponent={rubricComponent}
 *   setRubricComponent={setRubricComponent}
 * />
 */
const EditableMarkingRanges = ({ lastDisplayed, rubricComponent, setRubricComponent }) => {

    

    return (
        <>

            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                    <Accordion.Header>
                        Marking Ranges
                    </Accordion.Header>

                    <Accordion.Body>
                        <div className='my-2'>
                            Double-click a cell to modify its value!
                        </div>

                        <MarkingRangeTable
                            rubricComponent={rubricComponent}
                            setRubricComponent={setRubricComponent}
                        />

                        <AddNewMarkingRangeModalButton
                            rubricComponent={rubricComponent}
                            setRubricComponent={setRubricComponent}
                        />

                    </Accordion.Body>

                </Accordion.Item>
            </Accordion>
        </>

    )

}


export default EditableMarkingRanges