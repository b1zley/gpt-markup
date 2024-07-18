



import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { FloatingLabel } from 'react-bootstrap'


import { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'

const AddNewMarkingRangeModalDialogBox = ({ rubricComponent, setRubricComponent, setShowModal }) => {


    const [descriptionInput, setDescriptionInput] = useState('')
    const [minInclusive, setMinInclusive] = useState('')
    const [maxInclusive, setMaxInclusive] = useState('')


    async function handleSubmit(e) {
        e.preventDefault()
        console.log(descriptionInput)
        console.log(minInclusive)
        console.log(maxInclusive)


        // handle post request!


        // dynamically adjust render and close modal

    }



    return (
        <>
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





            </Form>

            <Modal.Footer>

                <Button variant="primary" type="submit" >
                    Submit
                </Button>

                <Button variant="secondary" onClick={(e) => setShowModal(false)} >
                    Close
                </Button>

            </Modal.Footer>
        </>
    )


}


export default AddNewMarkingRangeModalDialogBox