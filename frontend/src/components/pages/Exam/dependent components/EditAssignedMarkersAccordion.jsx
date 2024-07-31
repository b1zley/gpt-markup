
import { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import axiosToBackend from '../../../../axiosToBackend'


import LoadingSpinner from '../../../shared/LoadingSpinner'
import { Col, Row } from 'react-bootstrap'
import BASE_API_URL from '../../../../BASE_API_URL'
import useConfirmation from '../../../hooks/useConfirmation'



/**
 * A component that displays an accordion panel for managing assigned markers (super users) for an exam.
 * It includes functionality to fetch, display, remove, and add markers, with a loading spinner shown while data is being fetched.
 * 
 * @component
 * @example
 * ```jsx
 * <EditAssignedMarkersAccordion lastDisplayed={true} examInformation={examInformation} />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.lastDisplayed - A flag to determine if this is the last displayed accordion item.
 * @param {Object} props.examInformation - Contains information about the exam, including module ID and exam ID.
 * 
 * @returns {React.Element} The rendered accordion component.
 */
const EditAssignedMarkersAccordion = ({ lastDisplayed, examInformation }) => {

    // fetch assigned markers from api
    const [engagedSuperUsers, setEngagedSuperUsers] = useState([])
    const [dataFetched, setDataFetched] = useState(null)


    const [allMarkers, setAllMarkers] = useState([])
    const [markersToDisplay, setMarkersToDisplay] = useState([])

    const [selectedNewMarker, setSelectedNewMarker] = useState(undefined)

    const [confirm, ConfirmationModal] = useConfirmation()


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
            const engagedSuperUsersResponse = await axiosToBackend.get(apiGetEngagedSuperUsersURL)
            let newEngagedSuperUsers = engagedSuperUsersResponse.data
            // sort engagedSuperUsers according to super_user_type_id
            newEngagedSuperUsers.sort((a, b) => sortSuperUsers(a, b))
            setEngagedSuperUsers(newEngagedSuperUsers)


            // get all markers
            // super user type id corresponding to marker
            const marker_type_id = 2
            const getAllMarkersApiUrl = `${BASE_API_URL}super_user/super_user_type_id/${marker_type_id}`
            const markersApiResponse = await axiosToBackend.get(getAllMarkersApiUrl)
            let markersFromApi = markersApiResponse.data
            setAllMarkers(markersFromApi)

            handleEngagedMarkersChange(newEngagedSuperUsers, markersFromApi)
            setDataFetched(true)
        }
        handleFetch()
    }, [examInformation])


    async function handleRemoveAccessFromMarker(superUserId, indexToRemove) {
        try {
            const apiRemoveEngagedSuperUserURL = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/super_user/${superUserId}`
            const deleteRequestResponse = await axiosToBackend.delete(apiRemoveEngagedSuperUserURL)
            if (deleteRequestResponse.status === 204) {
                let newSuperUserArray = engagedSuperUsers.slice(0, indexToRemove).concat(engagedSuperUsers.slice(indexToRemove + 1))
                setEngagedSuperUsers(newSuperUserArray)
                handleEngagedMarkersChange(newSuperUserArray, allMarkers)
            } else {
                window.alert('Deletion failed!')
            }
        } catch (error) {
            await confirm('Failed to delete marker')
        }
    }

    async function handleNewMarkerSubmit(event) {
        try {
            event.preventDefault()
            let newSuperUserArray = engagedSuperUsers.slice(0, engagedSuperUsers.length)
            newSuperUserArray.push(JSON.parse(selectedNewMarker))
            newSuperUserArray.sort((a, b) => sortSuperUsers(a, b))
            // api post request
            const requestBody = {
                super_user_id: JSON.parse(selectedNewMarker).super_user_id
            }
            const apiUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/super_user/`
            const responseFromPost = await axiosToBackend.post(apiUrl, requestBody)
            if (responseFromPost.status === 201) {
                // handle in render
                setEngagedSuperUsers(newSuperUserArray)
                handleEngagedMarkersChange(newSuperUserArray, allMarkers)
                setSelectedNewMarker(undefined)
            } else{
                window.alert('Failed to add marker')
            }
        } catch (error) {
            await confirm('Failed to add marker')
        }
    }


    // handle loading...
    if (!dataFetched) {
        return (
            <Accordion className="my-0 " defaultActiveKey="0" >
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
        <Accordion className="my-0 " defaultActiveKey="0">
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
                                id='assignMarkerSelect'
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
                            <Button variant="primary" type="submit" className='my-1' id='assignMarkerButton'>
                                Add New Marker
                            </Button>
                        </Form>

                    </div>


                </Accordion.Body>
            </Accordion.Item>
            <ConfirmationModal />
        </Accordion>
    )

}


export default EditAssignedMarkersAccordion