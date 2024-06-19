
import { useEffect, useState } from 'react'
import axiosToBackend from '../../../axiosToBackend'

import { useParams, Link } from 'react-router-dom'
import BASE_API_URL from '../../../BASE_API_URL';
import { Accordion, Container } from 'react-bootstrap';
import LoadingSpinner from '../../shared/LoadingSpinner';



import EditableExamAccordion from '../Exam/dependent components/EditableExamAccordion';
import EditableMarkingRanges from './dependencies/EditableMarkingRanges';

const RubricComponentView = () => {
    let { module_id, exam_id, rubric_component_id } = useParams();
    const [rubricComponent, setRubricComponent] = useState(null)

    useEffect(() => {
        // fetch information on the rubric
        async function handleFetch() {
            const rubricComponentResponse = await axiosToBackend.get(`${BASE_API_URL}module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}`)
            setRubricComponent(rubricComponentResponse.data)
        }
        handleFetch()
    }, [module_id, exam_id, rubric_component_id])



    if (!rubricComponent) {
        return (
            <Container>
                <h3>Module Name: pending...</h3>
                <h4>Exam: pending...</h4>
                <h5>Rubric Component: pending...</h5>
                <LoadingSpinner />
            </Container>
        );
    }


    return (
        <>
            <Container>
                <div className='border border-light rounded p-3 d-flex flex-column' style={{ minHeight: '350px', flex: 1 }}>
                    <h3>
                        Module Name: <Link to={`/module/${module_id}`}>{rubricComponent.module_name}</Link>
                    </h3>
                    <h4>
                        Exam: <Link to={`/module/${module_id}/exam/${exam_id}`}>{rubricComponent.exam_name}</Link>
                    </h4>
                    <h5>
                        Rubric Component: {rubricComponent.name}
                    </h5>

                    <EditableExamAccordion
                        parentObject={rubricComponent}
                        setParentObject={setRubricComponent}
                        param={'rubric_component_desc'}
                        userFriendlyParam={'Description'}
                        lastDisplayed={false}
                        putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}`}
                    />

                    <EditableExamAccordion
                        parentObject={rubricComponent}
                        setParentObject={setRubricComponent}
                        param={'maximum'}
                        userFriendlyParam={'Maximum Points'}
                        lastDisplayed={false}
                        putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}/rubric/${rubric_component_id}`}
                        inputType={'decimal'}
                    />


                    <EditableMarkingRanges
                        lastDisplayed={true}
                        rubricComponent={rubricComponent}
                        setRubricComponent={setRubricComponent}
                    />

                </div>
            </Container>
        </>
    )


}


export default RubricComponentView