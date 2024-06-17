
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import { useEffect } from 'react'

import RatingRangeGroupDisplay from './RatingRangeGroupDisplay'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'
import RubricComponentsTable from './RubricComponentsTable'
import AddNewRubricComponent from './AddNewRubricComponent'



const RubricComponentsView = ({ lastDisplayed, examInformation, setExamInformation }) => {
    console.log(examInformation.rubric)
    const location = useLocation()



    return (
        <Accordion className="my-0 ">
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>Rubric</Accordion.Header>
                <Accordion.Body>
                    <RubricComponentsTable
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                    />
                    <hr className='divider' />
                    <AddNewRubricComponent
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                    />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}


export default RubricComponentsView