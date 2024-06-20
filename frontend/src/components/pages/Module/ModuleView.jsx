
import { useEffect, useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'

import axiosToBackend from '../../../axiosToBackend'


import BASE_API_URL from '../../../BASE_API_URL'

// components
import ExamsWithinModule from './ExamsWithinModule'
import LoadingSpinner from '../../shared/LoadingSpinner'
import CreateExamWithinModule from './CreateExamWithinModule'
import Placeholder from 'react-bootstrap/Placeholder'
import EditLecturersInModule from './EditLecturersInModule'

/**
 * view a single module
 * @returns 
 */
const ModuleView = () => {
    const { module_id } = useParams()
    // state
    const [viewedModule, setViewedModule] = useState(null)
    const [examsWithinModule, setExamsWithinModule] = useState([])
    const [promiseStatus, setPromiseStatus] = useState('pending')


    useEffect(() => {
        async function handleRender() {
            // get viewed module details
            const viewedModuleResponse = await axiosToBackend.get(`${BASE_API_URL}module/${module_id}`)
            setViewedModule(viewedModuleResponse.data[0])
            // get exams from viewed module
            const viewedModuleExamsResponse = await axiosToBackend.get(`${BASE_API_URL}module/${module_id}/exam`)
            setExamsWithinModule(viewedModuleExamsResponse.data)
            setPromiseStatus('complete')


        }
        handleRender()
    }, [module_id])


    if (promiseStatus != 'complete') {
        return (
            <Container style={{ height: '100%' }} >
                <div className='border border-light rounded p-3 d-flex flex-column' style={{ minHeight: '350px', flex: 1 }}>
                    <h3>
                        Module Name:
                        <Placeholder animation="glow" className='mx-1'>
                            <Placeholder xs={6} />
                        </Placeholder>
                    </h3>
                    <div className='d-flex justify-content-center align-items-center' style={{ flex: 1 }}>
                        <LoadingSpinner className='my-auto mx-auto' size={8} />
                    </div>

                </div>
            </Container >
        )
    }

    return (
        <Container style={{ height: '100%' }} >
            <div className='border border-light rounded p-3'>
                <h3>
                    Module Name: {viewedModule ? viewedModule.module_name : 'Pending...'}
                </h3>
                {examsWithinModule.length != 0
                    ?
                    <ExamsWithinModule module_id={module_id} examsWithinModule={examsWithinModule} setExamsWithinModule={setExamsWithinModule} />
                    : 'none found...'}
                <CreateExamWithinModule module_id={module_id} examsWithinModule={examsWithinModule} setExamsWithinModule={setExamsWithinModule} />
                <EditLecturersInModule
                    module_id={viewedModule.module_id}
                />
            </div>
        </Container >
    )

}

export default ModuleView