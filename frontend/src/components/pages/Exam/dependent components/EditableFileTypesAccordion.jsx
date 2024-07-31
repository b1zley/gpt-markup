

import { Fragment } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'
import useConfirmation from '../../../hooks/useConfirmation'



/**
 * A component that displays an accordion panel for managing file types associated with an exam.
 * It allows users to select which file types should be parsed by the LLM (Language Learning Model) during evaluation.
 * 
 * @component
 * @example
 * ```jsx
 * <EditableFileTypesAccordion
 *   lastDisplayed={true}
 *   examInformation={examInformation}
 *   setExamInformation={setExamInformation}
 * />
 * ```
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.lastDisplayed - A flag indicating if this is the last displayed accordion item.
 * @param {Object} props.examInformation - Contains information about the exam, including file types and lock status.
 * @param {Function} props.setExamInformation - Function to update the exam information state in the parent component.
 * 
 * @returns {React.Element} The rendered accordion component.
 */
const EditableFileTypesAccordion = ({ lastDisplayed, examInformation, setExamInformation }) => {

    const { fileTypes } = examInformation

    const [confirm, ConfirmationModal] = useConfirmation()

    async function handleFileTypeAllowedChange(event, fileType, index) {
        try {
            const isChecked = event.target.checked
            if (isChecked) {
                await handlePostRequestFileType(fileType.file_type_id)
            } else {
                await handleDeleteRequestFileType(fileType.file_type_id)
            }
            // update examInformation
            const updatedFileTypes = fileTypes.map((fileType, i) =>
                i === index ? { ...fileType, allowed: isChecked } : fileType
            )
            setExamInformation({ ...examInformation, fileTypes: updatedFileTypes })

        } catch (err) {
            await confirm('Failed to update file type')
            event.target.checked = false
        }

    }

    async function handlePostRequestFileType(file_type_id){
        const {module_id, exam_id} = examInformation
        const apiUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/file_type`
        const postBody = {
            file_type_id
        }
        const response = await axiosToBackend.post(apiUrl, postBody)
    }

    async function handleDeleteRequestFileType(file_type_id){
        const {module_id, exam_id} = examInformation
        const apiUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}/file_type/${file_type_id}`
        const response = await axiosToBackend.delete(apiUrl)

    }

    return (
        <>
            <Accordion className="my-0 " defaultActiveKey="0">
                <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>

                    <Accordion.Header>
                        File Types
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className='mb-2'>
                            Select which file types should be parsed by the LLM during evaluation.
                        </div>
                        <hr className='divider' />
                        <Form>
                            {fileTypes.map((fileType, i) => {

                                if(examInformation.is_locked){
                                    // disable
                                    return (
                                        <Fragment key={i} >
                                            <div className='d-flex'>
                                                <Form.Check
                                                    type="switch"
                                                    id={`fileType-${i}`}
                                                    onChange={(e) => { handleFileTypeAllowedChange(e, fileType, i) }}
                                                    
                                                    defaultChecked={fileType.allowed}
                                                    checked={fileType.allowed}
                                                    disabled
                                                />
                                                <p>{fileType.file_type_extension}</p>
                                            </div>
                                        </Fragment>
                                    )
                                } else {
                                    // don't
                                    return (
                                        <Fragment key={i}>
                                            <Form.Check
                                                type="switch"
                                                id={`fileType-${i}`}
                                                onChange={(e) => { handleFileTypeAllowedChange(e, fileType, i) }}
                                                label={`${fileType.file_type_extension}`}
                                                
                                                checked={fileType.allowed}
                                            />
                                        </Fragment>
                                    )
                                }
                                

                            })}


                        </Form>



                    </Accordion.Body>
                </Accordion.Item>  
                <ConfirmationModal hideClose={true} />


            </Accordion>

        </>
    )


}

export default EditableFileTypesAccordion