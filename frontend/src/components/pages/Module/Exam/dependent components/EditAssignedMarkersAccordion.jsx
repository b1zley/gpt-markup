
import { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import axios from 'axios'
import LoadingSpinner from '../../../../shared/LoadingSpinner'
import { Col, Row } from 'react-bootstrap'
import BASE_API_URL from '../../../../../BASE_API_URL'
const EditAssignedMarkersAccordion = ({ lastDisplayed, examInformation }) => {

    // fetch assigned markers from api
    const [engagedSuperUsers, setEngagedSuperUsers] = useState([])
    const [dataFetched, setDataFetched] = useState(null)

    function sortSuperUsers(a, b) {
        const aTypeId = a.super_user_type_id
        const bTypeId = b.super_user_type_id
        if (aTypeId === 1) {
            return 1
        } else if (bTypeId === 1) {
            return -1
        } else if (aTypeId === 3 && bTypeId === 2) {
            return 1
        } else if (bTypeId === 3 && aTypeId === 2) {
            return -1
        }
        return 0
    }

    useEffect(() => {
        async function handleFetch() {
            // get engaged super users
            const apiGetEngagedSuperUsersURL = `${BASE_API_URL}super_user/exam_search?module_id=${examInformation.module_id}&exam_id=${examInformation.exam_id}`
            const engagedSuperUsersResponse = await axios.get(apiGetEngagedSuperUsersURL)
            let engagedSuperUsers = engagedSuperUsersResponse.data
            // sort engagedSuperUsers according to super_user_type_id
            engagedSuperUsers.sort((a, b) => sortSuperUsers(a, b))
            setEngagedSuperUsers(engagedSuperUsers)


            // get all super users


            setDataFetched(true)
        }
        handleFetch()
    }, [examInformation])

    async function handleRemoveAccessFromMarker(superUserId, indexToRemove) {
        const apiRemoveEngagedSuperUserURL = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/super_user/${superUserId}`
        const deleteRequestResponse = await axios.delete(apiRemoveEngagedSuperUserURL)
        if (deleteRequestResponse.status === 204) {
            let newSuperUserArray = engagedSuperUsers.slice(0, indexToRemove).concat(engagedSuperUsers.slice(indexToRemove + 1))
            setEngagedSuperUsers(newSuperUserArray)
        } else {
            window.alert('Deletion failed!')
        }
    }

    // handle loading...
    if (!dataFetched) {
        return (
            <Accordion className="my-0 ">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                    <Accordion.Header>Engaged SuperUsers</Accordion.Header>
                    <Accordion.Body>
                        <LoadingSpinner />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }

    return (
        <Accordion className="my-0 ">
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>Engaged SuperUsers</Accordion.Header>
                <Accordion.Body>
                    <ListGroup>
                        {engagedSuperUsers.map((superUser, i) =>
                            <ListGroup.Item key={superUser.super_user_id}>
                                <Row>
                                    <Col xs={5} sm={6} md={8} lg={9} >
                                        {superUser.super_user_name}
                                        <div className='ms-auto'>
                                            ({superUser.super_user_type_name})
                                        </div>
                                    </Col>
                                    {superUser.super_user_type_id === 2 ?
                                        <Col xs={7} sm={6} md={4} lg={3}>

                                            <Button
                                                onClick={() => { handleRemoveAccessFromMarker(superUser.super_user_id, i) }}
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
                                        </Col> :
                                        null}

                                </Row>
                            </ListGroup.Item>
                        )}
                    </ListGroup>

                    <div className='my-2'>
                        <p className='ms-1'>
                            Add a new marker...
                        </p>
                        <Form.Select aria-label="Default select example">
                            <option>Select a new marker</option>
                            <option value="1">One</option>
                        </Form.Select>
                    </div>


                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}


export default EditAssignedMarkersAccordion