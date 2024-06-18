import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'

import RatingRangeGroupDisplay from '../Exam/dependent components/RatingRangeGroupDisplay'
import DoubleClickModifyMarkCell from './DoubleClickModifyMarkCell'
import ViewRatingsModal from './ViewRatingsModal'

const EditableRubricMarks = ({ lastDisplayed, examSubmissionInformation, setExamSubmissionInformation, activeDisplay }) => {

    return (

        <Accordion className="my-0 " defaultActiveKey={activeDisplay ? "0" : "1"} >
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>Rubric Marks</Accordion.Header>
                <Accordion.Body>

                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    Criteria
                                </th>
                                {/* <th>
                                    Ratings
                                </th> */}
                                <th>
                                    Max Points
                                </th>
                                <th>
                                    AI Critique
                                </th>
                                <th>
                                    AI Mark
                                </th>
                                <th>
                                    Agreed Critique
                                </th>
                                <th>
                                    Agreed Mark
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {examSubmissionInformation.rubric.map((rubric_component, i) =>
                                <tr key={rubric_component.rubric_component_id}>

                                    <td style={{ width: '30%' }}>
                                        <h6>{rubric_component.name}</h6>
                                        <p>{rubric_component.rubric_component_desc}</p>
                                        <ViewRatingsModal

                                            rating_ranges={rubric_component.rating_ranges}
                                        />
                                    </td>

                                    <td style={{ width: '5%' }}>
                                        {rubric_component.maximum}
                                    </td>
                                    <td style={{ width: '30%' }}>
                                        {rubric_component.ai_critique}
                                    </td>
                                    <td>
                                        {rubric_component.ai_mark}
                                    </td>
                                    <DoubleClickModifyMarkCell
                                        parameterInCell={'rubric_component_critique'}
                                        examSubmissionInformation={examSubmissionInformation}
                                        setExamSubmissionInformation={setExamSubmissionInformation}
                                        index={i}
                                    />

                                    <DoubleClickModifyMarkCell
                                        parameterInCell={'rubric_component_mark'}
                                        examSubmissionInformation={examSubmissionInformation}
                                        setExamSubmissionInformation={setExamSubmissionInformation}
                                        index={i}
                                    />


                                </tr>

                            )}


                        </tbody>

                    </Table>


                </Accordion.Body>
            </Accordion.Item>
        </Accordion>


    )

}


export default EditableRubricMarks