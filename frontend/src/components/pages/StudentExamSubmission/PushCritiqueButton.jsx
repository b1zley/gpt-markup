import { Button } from "react-bootstrap"
import BASE_API_URL from "../../../BASE_API_URL"
import axiosToBackend from "../../../axiosToBackend"
import useConfirmation from "../../hooks/useConfirmation"




const PushCritiqueButton = ({ index, rubric_component, examSubmissionInformation, setExamSubmissionInformation }) => {

    const [confirm, ConfirmationModal] = useConfirmation()

    async function handlePushAICritique() {

        try {
            const { ai_critique, ai_mark, rubric_component_id } = rubric_component
            const { module_id, exam_id, student_exam_submission_id } = examSubmissionInformation

            // request to server
            const putUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/student_exam_submission/${student_exam_submission_id}/rubric_component/${rubric_component_id}`
            
            const putBody1 = {
                rubric_component_mark: ai_mark
            }

            const putBody2 = {
                rubric_component_critique: ai_critique
            }

            console.log('attempting put')
            const responseFromPut1 = await axiosToBackend.put(putUrl, putBody1)
            const responseFromPut2 = await axiosToBackend.put(putUrl, putBody2)

            // update render
            const updatedExamSubmissionInformation = { ...examSubmissionInformation }

            updatedExamSubmissionInformation.rubric[index].rubric_component_critique = ai_critique
            updatedExamSubmissionInformation.rubric[index].rubric_component_mark = ai_mark

            setExamSubmissionInformation(updatedExamSubmissionInformation)
        } catch (err) {
            console.log(err)
            await confirm('Failed to push AI Critique')
        }
    }

    if (!rubric_component.ai_critique) {
        return (
            <>
                <ConfirmationModal />
                <Button disabled>
                    Generate AI Critique to Push
                </Button>
            </>
        )
    }

    return (
        <> 
            <ConfirmationModal />
            <Button onClick={() => { handlePushAICritique() }}>
                Push AI Critique
            </Button>
        </>
    )

}


export default PushCritiqueButton