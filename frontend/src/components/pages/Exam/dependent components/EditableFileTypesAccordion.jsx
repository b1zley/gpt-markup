

import { Fragment } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'
import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'

const EditableFileTypesAccordion = ({ lastDisplayed, examInformation, setExamInformation }) => {

    const { fileTypes } = examInformation

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
            window.alert('Failed to update file type')
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


                                return (
                                    <Fragment key={i}>
                                        <Form.Check
                                            type="switch"
                                            id={`fileType-${i}`}
                                            onChange={(e) => { handleFileTypeAllowedChange(e, fileType, i) }}
                                            label={`${fileType.file_type_extension}`}
                                            defaultChecked={fileType.allowed}
                                        />
                                    </Fragment>
                                )

                            })}


                        </Form>



                    </Accordion.Body>
                </Accordion.Item>


            </Accordion>

        </>
    )


}

export default EditableFileTypesAccordion