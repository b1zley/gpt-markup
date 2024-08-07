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
import EditableFileTypesAccordion from "./dependent components/EditableFileTypesAccordion";
import LockExamAccordion from "./dependent components/LockExamAccordion";
import AdvancedAISpecs from "./dependent components/AdvancedAISpecs";


/**
 * Overarching exam page component
 * responsible for: 
 *      'Exam Question',
        'File Types',
        'Rubric',
        'AI Options',
        'Model Answer',
        'Engaged SuperUsers',
        'Checklist',
        'Student Submissions'

    Component allows dynamic switching between these panels.
    Component fetches exam information via useEffect(), then uses panel components
 * @returns {ReactNode} A react element which renders exam information.
 */
const ExamView = () => {
    let { module_id, exam_id } = useParams();

    const [examInformation, setExamInformation] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('pending');


    const [activeAccordion, setActiveAccodrion] = useState([1, 0, 0, 0, 0, 0, 0, 0])




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
        'File Types',
        'Rubric',
        'AI Options',
        'Model Answer',
        'Engaged SuperUsers',
        'Checklist',
        'Student Submissions'
    ]

    const examQuestionDescription = `Input the exam question in its entirety.
    All information that is provided to the student should be provided here excluding any example data e.g. CSV files. This can also be uploaded as an RTF file.
    `

    const promptSpecificationDescription = `Input additional prompt specifications for the LLM here. These should be brief, and not speak to data formatting. Instead, this should be a declarative statement that helps the LLM to understand the context for the exam it is marking. e.g. You are a marker for a university level programming exam. The course your are marking is a Master's conversion course.`

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
                        uploadFunctionality={true}
                        description={examQuestionDescription}
                    />
                    :
                    null
                }


                {activeAccordion[1] === 1 ?
                    <EditableFileTypesAccordion
                        lastDisplayed={true}
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                    />
                    :
                    null
                }


                {activeAccordion[2] === 1 ?
                    <RubricComponentsView
                        examInformation={examInformation}
                        setExamInformation={setExamInformation}
                        lastDisplayed={true}
                    />
                    : null
                }

                {
                    activeAccordion[3] === 1 ?
                        <>
                            <EditableExamAccordion
                                parentObject={examInformation}
                                setParentObject={setExamInformation}
                                param={'prompt_specifications'}
                                userFriendlyParam={'Prompt Specifications'}
                                lastDisplayed={true}
                                putUrl={`${BASE_API_URL}module/${module_id}/exam/${exam_id}`}
                                description={promptSpecificationDescription}
                            />
                            <AdvancedAISpecs
                                examInformation={examInformation}
                                setExamInformation={setExamInformation}
                            />
                        </>

                        :
                        null
                }

                {
                    activeAccordion[4] === 1 ?
                        <UploadDownloadFileAccordion
                            activeDisplay={true}
                            parentObject={examInformation}
                            setParentObject={setExamInformation}
                            submissionType={'EXAM_MODEL_ANSWER'}
                            accordionName={'Model Answer'}
                            lastDisplayed={true}
                            hideControls={!!examInformation.is_locked}
                        />
                        :
                        null

                }


                {/* {
                    activeAccordion[4] === 1 ?
                        <EditAiModelAccordion
                            setExamInformation={setExamInformation}
                            examInformation={examInformation}
                        />
                        : null
                } */}


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
                        <LockExamAccordion
                            examInformation={examInformation}
                            setExamInformation={setExamInformation}
                        />
                        :
                        null
                }


                {
                    activeAccordion[7] === 1 ?
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
