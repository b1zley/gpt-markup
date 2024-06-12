
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


    const [allMarkers, setAllMarkers] = useState([])
    const [markersToDisplay, setMarkersToDisplay] = useState([])

    const [selectedNewMarker, setSelectedNewMarker] = useState(undefined)

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

    async function handleEngagedMarkersChange(engagedSuperUsersPassed, allMarkersPassed) {
        // find markers in engaged superusers
        const marker_type_id = 2
        const markersEngaged = engagedSuperUsersPassed.filter((superUser) => superUser.super_user_type_id === marker_type_id)
        let newMarkersToDisplay = allMarkersPassed.filter((marker) => {
            for (let i = 0; i < markersEngaged.length; i++) {
                const markerEngaged = markersEngaged[i]
                if (marker.super_user_id === markerEngaged.super_user_id) {
                    return false
                }
            }
            return true
        })
        setMarkersToDisplay(newMarkersToDisplay)

    }




    useEffect(() => {
        async function handleFetch() {
            // get engaged super users
            const apiGetEngagedSuperUsersURL = `${BASE_API_URL}super_user/exam_search?module_id=${examInformation.module_id}&exam_id=${examInformation.exam_id}`
            const engagedSuperUsersResponse = await axios.get(apiGetEngagedSuperUsersURL)
            let newEngagedSuperUsers = engagedSuperUsersResponse.data
            // sort engagedSuperUsers according to super_user_type_id
            newEngagedSuperUsers.sort((a, b) => sortSuperUsers(a, b))
            setEngagedSuperUsers(newEngagedSuperUsers)


            // get all markers
            // super user type id corresponding to marker
            const marker_type_id = 2
            const getAllMarkersApiUrl = `${BASE_API_URL}super_user/super_user_type_id/${marker_type_id}`
            const markersApiResponse = await axios.get(getAllMarkersApiUrl)
            let markersFromApi = markersApiResponse.data
            setAllMarkers(markersFromApi)

            handleEngagedMarkersChange(newEngagedSuperUsers, markersFromApi)
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
            handleEngagedMarkersChange(newSuperUserArray, allMarkers)
        } else {
            window.alert('Deletion failed!')
        }
    }

    async function handleNewMarkerSubmit(event) {
        event.preventDefault()
        let newSuperUserArray = engagedSuperUsers.slice(0, engagedSuperUsers.length)
        newSuperUserArray.push(JSON.parse(selectedNewMarker))
        newSuperUserArray.sort((a, b) => sortSuperUsers(a, b))
        // api post request
        const requestBody = {
            super_user_id: JSON.parse(selectedNewMarker).super_user_id
        }
        const apiUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/super_user/`
        const responseFromPost = await axios.post(apiUrl, requestBody)
        if (responseFromPost.status === 201) {
            // handle in render
            setEngagedSuperUsers(newSuperUserArray)
            handleEngagedMarkersChange(newSuperUserArray, allMarkers)
        } else{
            window.alert('Failed to add marker')
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
                        <Form onSubmit={handleNewMarkerSubmit}>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={(e) => setSelectedNewMarker(e.target.value)}
                                value={selectedNewMarker}
                            >
                                <option>Select a new marker</option>
                                {markersToDisplay.map((markerToDisplay) =>
                                    <option
                                        key={markerToDisplay.super_user_id}
                                        value={JSON.stringify(markerToDisplay)}
                                    >
                                        {markerToDisplay.super_user_name} - {markerToDisplay.super_user_id}
                                    </option>

                                )}
                            </Form.Select>
                            <Button variant="primary" type="submit" className='my-1'>
                                Add New Marker
                            </Button>
                        </Form>

                    </div>


                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}


export default EditAssignedMarkersAccordion