
import Table from 'react-bootstrap/Table'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'


import RatingRangeGroupDisplay from './RatingRangeGroupDisplay'
import BASE_API_URL from '../../../../../BASE_API_URL'

import axios from 'axios'


const RubricComponentsTable = ({ examInformation, setExamInformation }) => {


    

    async function handleRemoveRubricComponentClick(rubricComponent, i) {
        // delete request to api
        const { rubric_component_id } = rubricComponent
        const apiDeleteRequestURL = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/rubric/${rubric_component_id}`
        const responseFromDeleteRequest = await axios.delete(apiDeleteRequestURL)

        if (responseFromDeleteRequest.status === 204) {
            let updatedExamInformation = { ...examInformation }
            let updatedRubricList = examInformation.rubric.slice(0, i).concat(examInformation.rubric.slice(i + 1))
            updatedExamInformation.rubric = updatedRubricList
            setExamInformation(updatedExamInformation)
        } else {
            window.alert('Failed to remove rubric component')
        }
    }



    return (
        <>
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
                    {examInformation.rubric.map((rubric_component, i) =>
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
                            <td >
                                <div
                                    style={{ height: '100%' }}
                                    className='d-flex  align-items-center'
                                >
                                    <LinkContainer
                                        variant={'success'}
                                        to={`${location.pathname}/rubric_component/${rubric_component.rubric_component_id}`}
                                    >
                                        <Button >
                                            Edit
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        onClick={() => { handleRemoveRubricComponentClick(rubric_component, i) }}
                                        variant='warning'
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>

            </Table>


        </>

    )


}


export default RubricComponentsTable