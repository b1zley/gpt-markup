



import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { FloatingLabel } from 'react-bootstrap'


import { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'
import useConfirmation from '../../../hooks/useConfirmation'

import isValidNumber from '../../../../helperFunctions'


/**
 * `AddNewMarkingRangeModalDialogBox` is a modal dialog box component that allows users to add a new marking range to a rubric component.
 * 
 * This component provides a form with fields for a range description, minimum inclusive value, and maximum inclusive value.
 * It validates the input values, makes a POST request to add the new marking range, and updates the rubric component state.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.rubricComponent - The rubric component object containing current rating ranges
 * @param {Function} props.setRubricComponent - Function to update the rubric component state
 * @param {Function} props.setShowModal - Function to control the visibility of the modal
 * 
 * @example
 * <AddNewMarkingRangeModalDialogBox
 *   rubricComponent={rubricComponent}
 *   setRubricComponent={setRubricComponent}
 *   setShowModal={setShowModal}
 * />
 */
const AddNewMarkingRangeModalDialogBox = ({ rubricComponent, setRubricComponent, setShowModal }) => {


    const [descriptionInput, setDescriptionInput] = useState('')
    const [minInclusive, setMinInclusive] = useState('')
    const [maxInclusive, setMaxInclusive] = useState('')

    const [confirm, ConfirmationModal] = useConfirmation()

    // console.log(rubricComponent)


    

    async function handleSubmit(e) {
        try {
            e.preventDefault()

            if (!isValidNumber(minInclusive) || !isValidNumber(maxInclusive)) {
                //
                return await confirm('Failed to add new marking range - decimal values only for min and max inclusive!')
            }

            if(maxInclusive > Number.parseFloat(rubricComponent.maximum)){
                return await confirm('Failed to add new marking range - max must be less than rubric component maximum!')
            }
            if(minInclusive >= maxInclusive){
                return await confirm('Failed to add new marking range - min must be less than max!')
            }

            // check for overlap
            for (const rating_range of rubricComponent.rating_ranges){

                // check if min between rating_range min and max
                if(minInclusive >= rating_range.rating_min_incl && minInclusive <= rating_range.rating_max_incl){
                    return await confirm ('Failed to add new marking range - overlapping current range!')
                }
                // check if max between rating_range min and max

                if(maxInclusive >= rating_range.rating_min_incl && maxInclusive <= rating_range.rating_max_incl){
                    return await confirm ('Failed to add new marking range - overlapping current range!')
                }
            }



            // handle post request!
            let postBody = {
                rating_desc: descriptionInput,
                rating_min_incl: minInclusive,
                rating_max_incl: maxInclusive
            }

            const { module_id, exam_id, rubric_component_id } = rubricComponent
            const postUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}/rating_range/complete`
            const response = await axiosToBackend.post(postUrl, postBody)

            // update render
            postBody = { ...postBody, rating_range_id: response.data.rating_range_id }
            let newRatingRanges = [...rubricComponent.rating_ranges]
            newRatingRanges.push(postBody)
            let newRubricComponent = { ...rubricComponent }
            newRubricComponent.rating_ranges = newRatingRanges
            setRubricComponent(newRubricComponent)
            // close modal
            setShowModal(false)
        } catch (err) {
            console.log(err)
            await confirm('Failed to add new marking range')
        }
    }



    return (
        <>
            <ConfirmationModal />
            <Form onSubmit={(e) => handleSubmit(e)}>
                <FloatingLabel
                    controlId="floatingTextarea"
                    label="Range Description"
                    className="mb-3"
                    rows={5}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    value={descriptionInput}

                >

                    <Form.Control
                        as="textarea"
                        placeholder="Input range description here"
                        style={{ height: '150px' }}
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingTextarea"
                    label="Minimum Inclusive"
                    className="mb-3"
                    onChange={(e) => setMinInclusive(e.target.value)}
                    value={minInclusive}
                >

                    <Form.Control aria-label="Amount (to the nearest dollar)" placeholder='asd' />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingTextarea"
                    label="Maximum Inclusive"
                    className="mb-3"
                    onChange={(e) => setMaxInclusive(e.target.value)}
                    value={maxInclusive}
                >

                    <Form.Control aria-label="Amount (to the nearest dollar)" placeholder='asd' />
                </FloatingLabel>


                <Modal.Footer>

                    <Button variant="primary" type="submit" >
                        Submit
                    </Button>

                    <Button variant="secondary" onClick={(e) => setShowModal(false)} >
                        Close
                    </Button>

                </Modal.Footer>


            </Form>


        </>
    )


}


export default AddNewMarkingRangeModalDialogBox