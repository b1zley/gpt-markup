import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'

import RatingRangeGroupDisplay from '../Exam/dependent components/RatingRangeGroupDisplay'
import DoubleClickModifyMarkCell from './DoubleClickModifyMarkCell'
import ViewRatingsModal from './ViewRatingsModal'


/**
 * `EditableRubricMarks` is a component that displays rubric marks in a table format within an accordion.
 * It allows users to view and edit rubric components, including criteria, maximum points, AI critique, and agreed marks.
 * The table also includes modals for viewing rating guidelines.
 *
 * The component displays:
 * - Criteria and descriptions
 * - Maximum points for each criterion
 * - AI critique and AI marks
 * - Agreed critique and agreed marks
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.lastDisplayed - Indicates whether the item is the last displayed in the accordion.
 * @param {Object} props.examSubmissionInformation - Information about the exam submission, including rubric components.
 * @param {Function} props.setExamSubmissionInformation - Function to update the exam submission information.
 * @param {boolean} props.activeDisplay - Controls the initial open state of the accordion.
 * @returns {JSX.Element} The `EditableRubricMarks` component.
 *
 * @example
 * <EditableRubricMarks
 *   lastDisplayed={true}
 *   examSubmissionInformation={examInfo}
 *   setExamSubmissionInformation={setExamInfo}
 *   activeDisplay={true}
 * />
 */
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