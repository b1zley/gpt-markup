import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import BASE_API_URL from "../../../../BASE_API_URL";

// components
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Button from 'react-bootstrap/Button'
import LoadingSpinner from "../../../shared/LoadingSpinner";
import EditableExamAccordion from "./dependent components/EditableExamAccordion";
import UploadExamInfo from "../../../shared/UploadExamInfo";
import DownloadButton from "../../../shared/DownloadButton";
import EditAiModelAccordion from "./dependent components/EditAIModelAccordion";
import EditAssignedMarkersAccordion from "./dependent components/EditAssignedMarkersAccordion";
import StudentsInExamAccordion from "./dependent components/ExamSubmissionsAccordion";
import RubricComponentsView from "./dependent components/RubricComponentsView";
import UploadDownloadFileAccordion from "../../../shared/UploadDownloadFileAccordion";

const ExamView = () => {
    let { module_id, exam_id } = useParams();

    const [examInformation, setExamInformation] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('pending');




    // handleExamUpload

    async function handleExamUpload(examUploadResponse) {
        console.log('hello from exam upload')
        const newFileSystemId = examUploadResponse.data.file_system_id

        // put to exam information
        if (await sendExamPutRequest('file_system_id', newFileSystemId)) {
            let newExamInformation = { ...examInformation }
            newExamInformation.file_system_id = newFileSystemId
            setExamInformation(newExamInformation)
        } else {
            window.alert('error')
        }

    }

    async function sendExamPutRequest(param, newParamValue) {
        const apiPutUrl = `${BASE_API_URL}module/${examInformation.module_id}/exam/${examInformation.exam_id}`
        const putBody = {
            [param]: newParamValue
        }
        const responseFromPutRequest = await (axios.put(apiPutUrl, putBody))
        if (responseFromPutRequest.status === 200) {
            return true
        } else return false
    }


    useEffect(() => {
        const handleFetch = async () => {
            try {
                // fetch exam information from api
                const apiFetchUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}`;
                const responseFromGet = await axios.get(apiFetchUrl);
                setExamInformation(responseFromGet.data);



                setFetchStatus('complete');

            } catch (error) {
                console.error("Error fetching exam information:", error);
                setFetchStatus('error');
            }
        };
        handleFetch();
    }, [module_id, exam_id]);

    if (fetchStatus !== 'complete') {
        return (
            <Container>
                <h2>Module: {fetchStatus === 'complete' ? examInformation.module_name : 'pending...'}</h2>
                <h3>Exam: {fetchStatus === 'complete' ? examInformation.exam_name : 'pending...'}</h3>
                <LoadingSpinner />
            </Container>
        );
    }

    return (
        <Container>
            <div className='border border-light rounded p-3 d-flex flex-column' style={{ minHeight: '350px', flex: 1 }}>

                <h3>Module Name: <Link to={`/module/${module_id}`}>{examInformation.module_name}</Link> </h3>
                <h4>Exam: {examInformation.exam_name}</h4>

                <EditableExamAccordion
                    parentObject={examInformation}
                    setParentObject={setExamInformation}
                    param={'exam_question'}
                    userFriendlyParam={'Exam Question'}
                    lastDisplayed={false}
                    putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}`}
                />

                <RubricComponentsView
                    examInformation={examInformation}
                    setExamInformation={setExamInformation}
                    lastDisplayed={false}
                />


                <EditableExamAccordion
                    parentObject={examInformation}
                    setParentObject={setExamInformation}
                    param={'prompt_specifications'}
                    userFriendlyParam={'Prompt Specifications'}
                    lastDisplayed={false}
                    putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}`}
                />

                <UploadDownloadFileAccordion
                    parentObject={examInformation}
                    setParentObject={setExamInformation}
                    submissionType={'EXAM_MODEL_ANSWER'}
                    accordionName={'Model Answer'}
                    lastDisplayed={false}
                />

                <EditAiModelAccordion
                    setExamInformation={setExamInformation}
                    examInformation={examInformation}
                />
                <EditAssignedMarkersAccordion
                    lastDisplayed={false}
                    examInformation={examInformation}
                />

                <StudentsInExamAccordion
                    lastDisplayed={true}
                    examInformation={examInformation}
                />


            </div>
        </Container>
    );
};

export default ExamView;
