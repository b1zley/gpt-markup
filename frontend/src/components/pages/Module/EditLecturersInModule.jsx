
import { useState, useEffect } from 'react'
import { Form, ListGroup } from 'react-bootstrap'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'
import AddLecturerToModule from './AddLecturerToModule'


const EditLecturersInModule = ({ module_id }) => {

    const [lecturersInModule, setLecturersInModule] = useState([])
    const [allLecturers, setAllLecturers] = useState([])
    
    const [fetchLoading, setFetchLoading] = useState(true)
    


    useEffect(() => {

        async function handleFetch() {
            const apiGetLecturersUrl = `${BASE_API_URL}super_user/module/${module_id}`
            const responseFromGetLecturers = await axiosToBackend.get(apiGetLecturersUrl)
            setLecturersInModule(responseFromGetLecturers.data)

            // get all lecturers
            const lecturerTypeId = 3
            const apiGetAllLecturersUrl = `${BASE_API_URL}super_user/super_user_type_id/${lecturerTypeId}`
            const responseFromGetAllLecturers = await axiosToBackend.get(apiGetAllLecturersUrl)
            
            setAllLecturers(responseFromGetAllLecturers.data)
            setFetchLoading(false)
        }
        handleFetch()
    }, [module_id])


    async function handleRemoveAccessFromLecturer(super_user_id, index) {
        console.log(super_user_id)
        console.log(index)
        const apiDeleteUrl = `${BASE_API_URL}super_user/module/${module_id}/lecturer/${super_user_id}`
        const responseFromDelete = await axiosToBackend.delete(apiDeleteUrl)
        if (responseFromDelete.status === 204) {
            let newLecturers = lecturersInModule.slice(0, index).concat(lecturersInModule.slice(index + 1))
            setLecturersInModule(newLecturers)
        } else {
            window.alert('Failed to remove access')
        }
    }


    if(fetchLoading){
        return(
            'loading...'
        )
    }

    return (
        <div className='mx-auto mt-4 mb-2 border border-light rounded p-3' >
            <div>
                <h5>
                    Lecturers Assigned
                </h5>
                <ListGroup>
                    {lecturersInModule.length === 0 ?
                        <ListGroup.Item>
                            None added yet...
                        </ListGroup.Item>
                        :
                        lecturersInModule.map((lecturer, index) =>
                            <ListGroup.Item key={lecturer.super_user_id}>
                                <Row>
                                    <Col xs={5} sm={6} md={8} lg={9} >
                                        {lecturer.super_user_name}
                                    </Col>
                                    <Col xs={7} sm={6} md={4} lg={3}>
                                        <Button
                                            onClick={() => { handleRemoveAccessFromLecturer(lecturer.super_user_id, index) }}
                                            variant='warning'
                                            style={{
                                                height: '25px',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%'
                                            }}>
                                            Remove Access
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )
                    }
                </ListGroup>
            </div>
            <AddLecturerToModule
                lecturersInModule={lecturersInModule}
                setLecturersInModule={setLecturersInModule}
                allLecturers={allLecturers}
                module_id={module_id}
            />
            
        </div>
        

    )

}

export default EditLecturersInModule