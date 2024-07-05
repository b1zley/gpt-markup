import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axiosToBackend from '../../../axiosToBackend'

import BASE_API_URL from "../../../BASE_API_URL";

// components
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Button from 'react-bootstrap/Button'
import LoadingSpinner from "../../shared/LoadingSpinner";
import EditableExamAccordion from "./dependent components/EditableExamAccordion";
import UploadExamInfo from "../../shared/UploadExamInfo";
import DownloadButton from "../../shared/DownloadButton";
import EditAiModelAccordion from "./dependent components/EditAIModelAccordion";
import EditAssignedMarkersAccordion from "./dependent components/EditAssignedMarkersAccordion";
import StudentsInExamAccordion from "./dependent components/ExamSubmissionsAccordion";
import RubricComponentsView from "./dependent components/RubricComponentsView";
import UploadDownloadFileAccordion from "../../shared/UploadDownloadFileAccordion";
import ActiveAccordionControl from "./dependent components/ActiveAccordionControl";

const ExamView = () => {
    let { module_id, exam_id } = useParams();

    const [examInformation, setExamInformation] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('pending');


    const [activeAccordion, setActiveAccodrion] = useState([1, 0, 0, 0, 0, 0, 0])




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
        const responseFromPutRequest = await (axiosToBackend.put(apiPutUrl, putBody))
        if (responseFromPutRequest.status === 200) {
            return true
        } else return false
    }


    useEffect(() => {
        const handleFetch = async () => {
            try {
                // fetch exam information from api
                const apiFetchUrl = `${BASE_API_URL}module/${module_id}/exam/${exam_id}`;
                const responseFromGet = await axiosToBackend.get(apiFetchUrl);
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


    const nameArray = [
        'Exam Question',
        'Rubric',
        'Prompt Specifications',
        'Model Answer',
        'AI Model',
        'Engaged SuperUsers',
        'Student Submissions'
    ]

    return (
        <Container>
            <div className='border border-light rounded p-3 d-flex flex-column' style={{ minHeight: '350px', flex: 1 }}>

                <h3>Module Name: <Link to={`/module/${module_id}`}>{examInformation.module_name}</Link> </h3>
                <h4>Exam: {examInformation.exam_name}</h4>


                <ActiveAccordionControl
                    activeAccordion={activeAccordion}
                    setActiveAccordion={setActiveAccodrion}
                    nameArray={nameArray}
                />


                {activeAccordion[0] === 1 ?
                    <EditableExamAccordion
                        parentObject={examInformation}
                        setParentObject={setExamInformation}
                        param={'exam_question'}
                        userFriendlyParam={'Exam Question'}
                        lastDisplayed={true}
                        putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}`}
                        textBoxHeight={'550px'}
                    />
                    :
                    null
                }


                {activeAccordion[1] === 1 ?
                    <RubricComponentsView
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                        lastDisplayed={true}
                    />
                    : null
                }

                {
                    activeAccordion[2] === 1 ?
                        <EditableExamAccordion
                            parentObject={examInformation}
                            setParentObject={setExamInformation}
                            param={'prompt_specifications'}
                            userFriendlyParam={'Prompt Specifications'}
                            lastDisplayed={true}
                            putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}`}
                        />
                        :
                        null
                }

                {
                    activeAccordion[3] === 1 ?
                        <UploadDownloadFileAccordion
                            activeDisplay={true}
                            parentObject={examInformation}
                            setParentObject={setExamInformation}
                            submissionType={'EXAM_MODEL_ANSWER'}
                            accordionName={'Model Answer'}
                            lastDisplayed={true}
                        />
                        :
                        null

                }


                {
                    activeAccordion[4] === 1 ?
                        <EditAiModelAccordion
                            setExamInformation={setExamInformation}
                            examInformation={examInformation}
                        />
                        : null
                }


                {
                    activeAccordion[5] === 1 ?
                        <EditAssignedMarkersAccordion
                            lastDisplayed={true}
                            examInformation={examInformation}
                        />
                        : null
                }

                {
                    activeAccordion[6] === 1 ?
                        <StudentsInExamAccordion
                            active={activeAccordion[6] === 1}
                            lastDisplayed={true}
                            examInformation={examInformation}
                        />
                        : null
                }



            </div>
        </Container>
    );
};

export default ExamView;
