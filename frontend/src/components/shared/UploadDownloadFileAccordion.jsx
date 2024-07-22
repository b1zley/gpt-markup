

import { Accordion } from "react-bootstrap"
import UploadExamInfo from "./UploadExamInfo"
import DownloadButton from "./DownloadButton"

import BASE_API_URL from "../../BASE_API_URL"

import axiosToBackend from '../../axiosToBackend'


import { useEffect } from 'react'

import MyFileBrowser from "../pages/MyFileBrowser/MyFileBrowser"
import ContentDisplayModal from "./ContentDisplayModal"
import useConfirmation from "../hooks/useConfirmation"

const UploadDownloadFileAccordion = ({ parentObject, setParentObject, submissionType, accordionName, lastDisplayed, activeDisplay, hideControls }) => {

    const [confirm, ConfirmationModal] = useConfirmation()

    async function handleExamUpload(examUploadResponse) {
        try {
            const newFileSystemId = examUploadResponse.data.file_system_id
    
            // put to exam information
            if (await sendExamPutRequest('file_system_id', newFileSystemId)) {
                let newParentObject = { ...parentObject }
                newParentObject.file_system_id = newFileSystemId
                setParentObject(newParentObject)
            } else {
                window.alert('error')
            }
        } catch (error) {
            //
            console.log('helol from error')
            await confirm('Failed to handle exam upload')
        }

    }



    // update exam...
    async function sendExamPutRequest(param, newParamValue) {
            let apiPutUrl
            switch (submissionType) {
                case 'EXAM_SUBMISSION':
                    apiPutUrl = `${BASE_API_URL}module/${parentObject.module_id}/exam/${parentObject.exam_id}/student_exam_submission/${parentObject.student_exam_submission_id}`
                    break;
    
                case 'EXAM_MODEL_ANSWER':
                    apiPutUrl = `${BASE_API_URL}module/${parentObject.module_id}/exam/${parentObject.exam_id}`
                    break;
    
                default:
                    throw new Error('Invalid submission type')
            }
    
    
            const putBody = {
                [param]: newParamValue
            }
            const responseFromPutRequest = await (axiosToBackend.put(apiPutUrl, putBody))
            console.log('hello from what')
            if (responseFromPutRequest.status === 200) {
                return true
            } else return false
        
    }

    // or update exam submission



    return (
        <Accordion className="my-0 " defaultActiveKey={activeDisplay ? "0" : ""} >
            <ConfirmationModal />
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>
                    {accordionName}
                </Accordion.Header>
                <Accordion.Body >
                    <div className="d-flex">

                        {hideControls ?
                            'Mark exam as unready in checklist to upload a new project file.'
                            :
                            <UploadExamInfo
                                className='ms-0'
                                submissionType={submissionType}
                                handleExamUpload={handleExamUpload}
                            />
                        }


                        <DownloadButton
                            className='ms-auto'
                            loadCondition={parentObject.file_system_id}
                            downloadUrl={`${BASE_API_URL}file_system/download_zip/${submissionType}/${parentObject.file_system_id}`}
                            fileName={parentObject.student_number ? `${submissionType}-${parentObject.exam_name}-${parentObject.student_number}.zip` : `${submissionType}-${parentObject.exam_name}.zip`}
                            height='120px'
                        />
                    </div>


                    {parentObject.file_system_id ?
                    <ContentDisplayModal 
                        contentTitle={'Project Files'}
                        contentToDisplay={<MyFileBrowser basePath={`${submissionType}x--xextractedx--x${parentObject.file_system_id}`} /> }
                        size='xl'
                    />
                    
                    // <MyFileBrowser basePath={`${submissionType}x--xextractedx--x${parentObject.file_system_id}`} />
                    
                    
                    :
                    
                    'None uploaded'}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>)


}


export default UploadDownloadFileAccordion