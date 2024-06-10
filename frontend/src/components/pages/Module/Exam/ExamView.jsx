import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import BASE_API_URL from "../../../../BASE_API_URL";

// components
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Button from 'react-bootstrap/Button'
import LoadingSpinner from "../../../shared/LoadingSpinner";
import EditableExamAccordion from "./EditableExamAccordion";
import UploadExamInfo from "../../../shared/UploadExamInfo";
import DownloadButton from "../../../shared/DownloadButton";
import EditAiModelAccordion from "./EditAIModelAccordion";

const ExamView = () => {
    let { module_id, exam_id } = useParams();

    const [examInformation, setExamInformation] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('pending');

    const [aIModelsToChoose, setAiModelsToChoose] = useState([])



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
                console.log(responseFromGet.data)

                // fetch ai model information from api
                
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
                    examInformation={examInformation}
                    setExamInformation={setExamInformation}
                    examParam={'exam_question'}
                    userFriendlyExamParam={'Exam Question'}
                    lastDisplayed={false}
                />

                <EditableExamAccordion
                    examInformation={examInformation}
                    setExamInformation={setExamInformation}
                    examParam={'rubric'}
                    userFriendlyExamParam={'Rubric'}
                    lastDisplayed={false}
                />

                <EditableExamAccordion
                    examInformation={examInformation}
                    setExamInformation={setExamInformation}
                    examParam={'prompt_specifications'}
                    userFriendlyExamParam={'Prompt Specifications'}
                    lastDisplayed={false}
                />


                <Accordion className="my-0 ">
                    <Accordion.Item eventKey="0" className="border-bottom-0">
                        <Accordion.Header>
                            Model Answer
                        </Accordion.Header>
                        <Accordion.Body className="d-flex">
                            <UploadExamInfo
                                className='ms-0'
                                submissionType={'EXAM_MODEL_ANSWER'}
                                handleExamUpload={handleExamUpload}
                            />
                            <DownloadButton
                                className='ms-auto'
                                loadCondition={examInformation.file_system_id}
                                downloadUrl={`${BASE_API_URL}file_system/download_zip/EXAM_MODEL_ANSWER/${examInformation.file_system_id}`}
                                fileName={`modelAnswer${examInformation.exam_name}.zip`}
                                height='120px'
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                
                <EditAiModelAccordion 
                    aIModelName={examInformation.model_name}
                    setExamInformation={setExamInformation}
                    examInformation={examInformation}
                    
                />

            </div>
        </Container>
    );
};

export default ExamView;
