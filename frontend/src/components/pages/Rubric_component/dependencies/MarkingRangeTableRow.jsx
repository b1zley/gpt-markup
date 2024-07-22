import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useState } from 'react'
import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'

import DoubleClickModifyCell from './DoubleClickModifyCell'
import useConfirmation from '../../../hooks/useConfirmation'

const MarkingRangeTableRow = ({ rubricComponent, setRubricComponent, index }) => {

    const [confirm, ConfirmationModal] = useConfirmation()



    const DeletionModalBody = () => {
        return (<>
            <div className='mb-0'>Are you sure you want to delete the following rating range:</div>
            <strong className='mt-1'>{rubricComponent.rating_ranges[index].rating_desc}</strong>
            <p>This action is irreversible!</p>
        </>
        )
    }


    async function handleRemoveButtonClick(event) {
        const ratingRangeIdToDelete = rubricComponent.rating_ranges[index].rating_range_id
        const confirmation = await confirm(<DeletionModalBody />)
        if (!confirmation) {
            return
        }
        const apiDeleteUrl = `${BASE_API_URL}module/${rubricComponent.module_id}/exam/${rubricComponent.exam_id}/rubric/${rubricComponent.rubric_component_id}/rating_range/${ratingRangeIdToDelete}`
        const responseFromDelete = await axiosToBackend.delete(apiDeleteUrl)

        if (responseFromDelete.status === 204) {
            // do stuff
            let updatedRubricComponent = { ...rubricComponent }
            let updatedRatingRanges = rubricComponent.rating_ranges.slice(0, index).concat(rubricComponent.rating_ranges.slice(index + 1))
            updatedRubricComponent.rating_ranges = updatedRatingRanges
            setRubricComponent(updatedRubricComponent)
        } else {
            window.alert('Failed to delete rating range')
        }

    }


    return (

        <>
            <tr >
                <DoubleClickModifyCell
                    parameterInCell={'rating_desc'}
                    rubricComponent={rubricComponent}
                    setRubricComponent={setRubricComponent}
                    index={index}
                    dataType={'text'}
                />
                <DoubleClickModifyCell
                    parameterInCell={'rating_min_incl'}
                    rubricComponent={rubricComponent}
                    setRubricComponent={setRubricComponent}
                    index={index}
                    dataType={'decimal'}
                />
                <DoubleClickModifyCell
                    parameterInCell={'rating_max_incl'}
                    rubricComponent={rubricComponent}
                    setRubricComponent={setRubricComponent}
                    index={index}
                    dataType={'decimal'}
                />
                <td>
                    <Button variant="warning" onClick={handleRemoveButtonClick}>
                        Remove
                    </Button>
                </td>
            </tr>
            <ConfirmationModal />
        </>
    )




}



export default MarkingRangeTableRow