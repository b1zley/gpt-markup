
import Table from 'react-bootstrap/Table'
import MarkingRangeTableRow from './MarkingRangeTableRow'

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