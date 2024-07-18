
import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import MarkingRangeTableRow from './MarkingRangeTableRow'
import MarkingRangeTable from './MarkingRangeTable'
import AddNewMarkingRangeButton from './AddNewMarkingRangeButton'
import AddNewMarkingRangeModalButton from './AddNewMarkingRangeModalButton'

const EditableMarkingRanges = ({ lastDisplayed, rubricComponent, setRubricComponent }) => {

    return (
        <Accordion>
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>
                    Marking Ranges
                </Accordion.Header>

                <Accordion.Body>
                    <MarkingRangeTable
                        rubricComponent={rubricComponent}
                        setRubricComponent={setRubricComponent}
                    />
                    <AddNewMarkingRangeButton
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
    )

}


export default EditableMarkingRanges