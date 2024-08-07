
import Table from 'react-bootstrap/Table'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button'


import RatingRangeGroupDisplay from './RatingRangeGroupDisplay'
import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'

import useConfirmation from '../../../hooks/useConfirmation'


/**
 * Displays a table of rubric components for an exam. Allows for editing and deletion of components, provided the exam is not locked.
 * 
 * @component
 * @example
 * ```jsx
 * <RubricComponentsTable
 *   examInformation={examInformation}
 *   setExamInformation={setExamInformation}
 *   hideControls={false}
 * />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {Object} props.examInformation - Object containing information about the exam, including rubric details.
 * @param {Function} props.setExamInformation - Function to update the exam information.
 * @param {boolean} [props.hideControls=false] - If true, hides the controls for editing and removing rubric components.
 *
 * @returns {React.Element} The rendered component.
 */
const RubricComponentsTable = ({ examInformation, setExamInformation, hideControls }) => {

    const [confirm, ConfirmationModal] = useConfirmation()


    const DeleteRCConfirmationModalBody = ({ rubricComponent }) => {
        return (
            <>
                <div>Are you sure you want to delete this rubric component:</div>
                <strong>
                    {rubricComponent.name}
                </strong>
                <div>This action is irreversible!</div>
            </>
        )
    }

    async function handleRemoveRubricComponentClick(rubricComponent, i) {
        try {
            const confirmation = await confirm(<DeleteRCConfirmationModalBody rubricComponent={rubricComponent} />)
            if (!confirmation) {
                return
            }
            // delete request to api
            const { rubric_component_id } = rubricComponent
            const apiDeleteRequestURL = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}/rubric/${rubric_component_id}`
            const responseFromDeleteRequest = await axiosToBackend.delete(apiDeleteRequestURL)
    
            if (responseFromDeleteRequest.status === 204) {
                let updatedExamInformation = { ...examInformation }
                let updatedRubricList = examInformation.rubric.slice(0, i).concat(examInformation.rubric.slice(i + 1))
                updatedExamInformation.rubric = updatedRubricList
                setExamInformation(updatedExamInformation)
            } else {
                window.alert('Failed to remove rubric component')
            }
        } catch (error) {
            await confirm('Failed to remove rubric component')
        }
    }

    if (examInformation.is_locked) {
        hideControls = examInformation.is_locked
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
                        {hideControls ? null : <th>
                            Controls
                        </th>}

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
                                {console.log('rubric component', rubric_component)}
                                <RatingRangeGroupDisplay
                                    rating_ranges={rubric_component.rating_ranges}
                                />
                            </td>
                            <td>
                                {rubric_component.maximum}
                            </td>

                            {hideControls ? null :
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

                            }

                        </tr>
                    )}
                </tbody>

            </Table>

            <ConfirmationModal />
        </>

    )


}


export default RubricComponentsTable