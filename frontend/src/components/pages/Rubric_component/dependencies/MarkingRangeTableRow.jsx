import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useState } from 'react'
import BASE_API_URL from '../../../../BASE_API_URL'

import axios from 'axios'
import DoubleClickModifyCell from './DoubleClickModifyCell'

const MarkingRangeTableRow = ({ rubricComponent, setRubricComponent, index }) => {
    async function handleRemoveButtonClick(event) {
        const ratingRangeIdToDelete = rubricComponent.rating_ranges[index].rating_range_id

        const apiDeleteUrl = `${BASE_API_URL}module/${rubricComponent.module_id}/exam/${rubricComponent.exam_id}/rubric/${rubricComponent.rubric_component_id}/rating_range/${ratingRangeIdToDelete}`
        const responseFromDelete = await axios.delete(apiDeleteUrl)

        if (responseFromDelete.status === 204) {
            // do stuff
            let updatedRubricComponent = { ...rubricComponent }
            let updatedRatingRanges = rubricComponent.rating_ranges.slice(0, index).concat(rubricComponent.rating_ranges.slice(index+1))
            updatedRubricComponent.rating_ranges = updatedRatingRanges
            setRubricComponent(updatedRubricComponent)
        } else {
            window.alert('Failed to delete rating range')
        }

    }


    return (
        <tr >
            <DoubleClickModifyCell
                parameterInCell={'rating_desc'}
                rubricComponent={rubricComponent}
                setRubricComponent={setRubricComponent}
                index={index}
            />
            <DoubleClickModifyCell
                parameterInCell={'rating_min_incl'}
                rubricComponent={rubricComponent}
                setRubricComponent={setRubricComponent}
                index={index}
            />
            <DoubleClickModifyCell
                parameterInCell={'rating_max_incl'}
                rubricComponent={rubricComponent}
                setRubricComponent={setRubricComponent}
                index={index}
            />
            <td>
                <Button variant="warning" onClick={handleRemoveButtonClick}>
                    Remove
                </Button>
            </td>
        </tr>
    )




}



export default MarkingRangeTableRow