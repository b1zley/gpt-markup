
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import { useEffect } from 'react'

import RatingRangeGroupDisplay from './RatingRangeGroupDisplay'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'



const RubricComponentsView = ({ lastDisplayed, examInformation, setExamInformation }) => {
    console.log(examInformation.rubric)
    const location = useLocation()



    return (
        <Accordion className="my-0 ">
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>Rubric</Accordion.Header>
                <Accordion.Body>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    Criteria
                                </th>
                                <th>
                                    Ratings
                                </th>
                                <th>
                                    Max Points
                                </th>
                                <th>
                                    Controls
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {examInformation.rubric.map((rubric_component) =>
                                <tr key={rubric_component.rubric_component_id}>
                                    <td>
                                        <h6>{rubric_component.name}</h6>
                                        <p>{rubric_component.rubric_component_desc}</p>
                                    </td>
                                    <td>
                                        <RatingRangeGroupDisplay
                                            rating_ranges={rubric_component.rating_ranges}
                                        />
                                    </td>
                                    <td>
                                        {rubric_component.maximum}
                                    </td>
                                    <td>
                                        <LinkContainer to={`${location.pathname}/rubric_component/${rubric_component.rubric_component_id}`}>
                                            <Button>
                                                View
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}


export default RubricComponentsView