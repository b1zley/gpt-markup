

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useState, useEffect } from 'react'
import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'
import useConfirmation from '../../hooks/useConfirmation'


/**
 * `AddLecturerToModule` is a component that allows users to assign a lecturer to a specific module.
 * It provides a dropdown to select from available lecturers who are not yet assigned to the module and 
 * handles the addition of a selected lecturer via an API request.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.lecturersInModule - The current list of lecturers assigned to the module.
 * @param {Function} props.setLecturersInModule - The function to update the list of lecturers assigned to the module.
 * @param {Array} props.allLecturers - The complete list of lecturers.
 * @param {string} props.module_id - The ID of the module to which the lecturer will be added.
 * 
 * @example
 * return (
 *   <AddLecturerToModule 
 *     lecturersInModule={lecturersInModule}
 *     setLecturersInModule={setLecturersInModule}
 *     allLecturers={allLecturers}
 *     module_id="123" 
 *   />
 * );
 */
const AddLecturerToModule = ({ lecturersInModule, setLecturersInModule, allLecturers, module_id }) => {

    const [lecturersToShow, setLecturersToShow] = useState([])
    const [lecturerToAddId, setLecturerToAdd] = useState('')


    const [confirm, ConfirmationModal] = useConfirmation()

    useEffect(() => {
        let updatedLecturersToShow = []
        updatedLecturersToShow = allLecturers.filter((lecturer) => {
            for (const lecturerInModule of lecturersInModule) {
                if (lecturer.super_user_id === lecturerInModule.super_user_id) {
                    return false
                }
            }
            return true
        })
        setLecturersToShow(updatedLecturersToShow)

    }, [lecturersInModule, allLecturers])



    async function handleSubmitLecturerAdd(event) {
        try {
            event.preventDefault()
            const postUrl = `${BASE_API_URL}super_user/module/${module_id}/lecturer`
            const postBody = {
                super_user_id: lecturerToAddId
            }
            const responseFromPost = await axiosToBackend.post(postUrl, postBody)
            if (responseFromPost.status === 201) {
                let updatedLecturersInModule = lecturersInModule.slice(0, lecturersInModule.length)
                let lecturerToAddObject = allLecturers.find((lecturer) => Number.parseInt(lecturer.super_user_id) === Number.parseInt(lecturerToAddId))
                updatedLecturersInModule.push(lecturerToAddObject)
                setLecturersInModule(updatedLecturersInModule)
            } 
        } catch (error) {
            await confirm('Failed to add lecturer')
        }

    }


    return (
        <div className='my-1'>
            <ConfirmationModal />
            <h6>Assign lecturer:</h6>
            <Form onSubmit={handleSubmitLecturerAdd}>
                <Form.Select
                    aria-label="Default select example"
                    onChange={(event) => { setLecturerToAdd(event.target.value) }}
                    value={lecturerToAddId}
                    id='lecturerSelect'
                >
                    <option >Select a lecturer</option>
                    {lecturersToShow.map((lecturer) =>
                        <option
                            value={lecturer.super_user_id}
                            key={lecturer.super_user_id}
                        >
                            {lecturer.super_user_name}
                        </option>

                    )}


                </Form.Select>

                {lecturerToAddId ?
                    <Button className='my-1' type='submit' id='addLecturerButton'>
                        Add Lecturer
                    </Button>
                    :
                    <Button className='my-1' type='submit' disabled>
                        Add Lecturer
                    </Button>
                 }

            </Form>
        </div>
    )

}


export default AddLecturerToModule