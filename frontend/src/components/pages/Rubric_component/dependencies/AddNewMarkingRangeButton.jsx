
import Button from 'react-bootstrap/Button'
import BASE_API_URL from '../../../../BASE_API_URL'

import axiosToBackend from '../../../../axiosToBackend'


/**
 * `AddNewMarkingRangeButton` is a button component that triggers the addition of a new marking range to a rubric component.
 * 
 * This component renders a button that, when clicked, sends a POST request to add a new marking range to the rubric component. If the request is successful, it updates the rubric component state with the newly created marking range.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.rubricComponent - The rubric component object containing current rating ranges
 * @param {Function} props.setRubricComponent - Function to update the rubric component state
 * 
 * @example
 * <AddNewMarkingRangeButton
 *   rubricComponent={rubricComponent}
 *   setRubricComponent={setRubricComponent}
 * />
 */
const AddNewMarkingRangeButton = ({rubricComponent, setRubricComponent}) => {
    

    async function handleAddNewMarkingRangeClick(event){
        const addNewRangeUrl = `${BASE_API_URL}module/${rubricComponent.module_id}/exam/${rubricComponent.exam_id}/rubric/${rubricComponent.rubric_component_id}/rating_range`
        const responseFromPost = await axiosToBackend.post(addNewRangeUrl)
        if(responseFromPost.status === 201){
            // do stuff
            const newRatingRangeObject = {
                rating_desc:null,
                rating_max_incl:null,
                rating_min_incl:null,
                rating_range_id:responseFromPost.data.rating_range_id,
                rubric_component_id:rubricComponent.rubric_component_id
            }
            let updatedRubricComponent = {...rubricComponent}
            updatedRubricComponent.rating_ranges.push(newRatingRangeObject)
            setRubricComponent(updatedRubricComponent)
        } else{
            window.alert('Failed to add new marking range')
        }
    }

    return(
        <Button onClick={handleAddNewMarkingRangeClick}>
            Add new marking range
        </Button>
    )

}


export default AddNewMarkingRangeButton