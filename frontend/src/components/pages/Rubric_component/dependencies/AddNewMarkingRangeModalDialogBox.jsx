



import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { FloatingLabel } from 'react-bootstrap'


import { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'
import useConfirmation from '../../../hooks/useConfirmation'

const AddNewMarkingRangeModalDialogBox = ({ rubricComponent, setRubricComponent, setShowModal }) => {


    const [descriptionInput, setDescriptionInput] = useState('')
    const [minInclusive, setMinInclusive] = useState('')
    const [maxInclusive, setMaxInclusive] = useState('')

    const [confirm, ConfirmationModal] = useConfirmation()

    // console.log(rubricComponent)

    async function handleSubmit(e) {
        try {
            e.preventDefault()
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