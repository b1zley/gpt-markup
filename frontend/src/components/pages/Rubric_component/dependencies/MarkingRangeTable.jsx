
import Table from 'react-bootstrap/Table'
import MarkingRangeTableRow from './MarkingRangeTableRow'


/**
 * `MarkingRangeTable` is a React component that displays a table of rating ranges for a rubric component.
 * 
 * This component renders a table with columns for the range description, minimum inclusive value, maximum inclusive value, and controls. Each row in the table represents a rating range and is editable or deletable.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.rubricComponent - The rubric component containing rating ranges
 * @param {Function} props.setRubricComponent - Function to update the rubric component state
 * @example
 * <MarkingRangeTable
 *   rubricComponent={rubricComponent}
 *   setRubricComponent={setRubricComponent}
 * />
 */
const MarkingRangeTable = ({ rubricComponent, setRubricComponent }) => {


    return(
        <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th >
                                    Range Description
                                </th>
                                <th >
                                    Minimum Inclusive
                                </th>
                                <th >
                                    Maximum Inclusive
                                </th>
                                <th>
                                    Controls
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rubricComponent.rating_ranges.map((rating_range, i) =>

                                <MarkingRangeTableRow
                                    key={i}
                                    index={i}
                                    rubricComponent={rubricComponent}
                                    setRubricComponent={setRubricComponent}
                                />
                            )}

                        </tbody>

                    </Table>
    )



}


export default MarkingRangeTable