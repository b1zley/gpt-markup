

import { Accordion } from "react-bootstrap"
import UploadExamInfo from "./UploadExamInfo"
import DownloadButton from "./DownloadButton"

import BASE_API_URL from "../../BASE_API_URL"

import axiosToBackend from '../../axiosToBackend'


import {useEffect} from 'react'


const UploadDownloadFileAccordion = ({ parentObject, setParentObject, submissionType, accordionName, lastDisplayed, activeDisplay }) => {

    async function handleExamUpload(examUploadResponse) {
        const newFileSystemId = examUploadResponse.data.file_system_id

        // put to exam information
        if (await sendExamPutRequest('file_system_id', newFileSystemId)) {
            let newParentObject = { ...parentObject }
            newParentObject.file_system_id = newFileSystemId
            setParentObject(newParentObject)
        } else {
            window.alert('error')
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
        if (responseFromPutRequest.status === 200) {
            return true
        } else return false
    }

    // or update exam submission



    return (
        <Accordion className="my-0 " defaultActiveKey={activeDisplay ? "0" : ""}>
            <Accordion.Item eventKey="0" className={lastDisplayed ? null : "border-bottom-0"}>
                <Accordion.Header>
                    {accordionName}
                </Accordion.Header>
                <Accordion.Body className="d-flex">
                    <UploadExamInfo
                        className='ms-0'
                        submissionType={submissionType}
                        handleExamUpload={handleExamUpload}
                    />
                    <DownloadButton
                        className='ms-auto'
                        loadCondition={parentObject.file_system_id}
                        downloadUrl={`${BASE_API_URL}file_system/download_zip/${submissionType}/${parentObject.file_system_id}`}
                        fileName={parentObject.student_number ? `${submissionType}-${parentObject.exam_name}-${parentObject.student_number}.zip` : `${submissionType}-${parentObject.exam_name}.zip`}
                        height='120px'
                    />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>)


}


export default UploadDownloadFileAccordion