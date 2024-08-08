import Container from "react-bootstrap/Container"
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import { useEffect, useState } from 'react'
import BASE_API_URL from "../../../BASE_API_URL"

import axiosToBackend from "../../../axiosToBackend"
import { Link } from 'react-router-dom'
import EditableModuleDisplay from "./dependencies/EditableModuleDisplay"
import CreateModule from "./dependencies/CreateModule"


/**
 * `ModulesView` is a component that displays a list of modules and provides options to create or edit modules.
 * It fetches the list of modules from an API and displays them using `EditableModuleDisplay`.
 * Additionally, it provides a `CreateModule` component to add new modules.
 * 
 * @component
 * @example
 * return <ModulesView />;
 */
const ModulesView = () => {

    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function handleFetch() {
            const apiGetUrl = `${BASE_API_URL}module`
            const responseFromModuleGet = await axiosToBackend.get(apiGetUrl)
            const updatedModules = responseFromModuleGet.data
            setModules(updatedModules)
            setLoading(false)
        }

        handleFetch()
    }, [])
    if (loading) {
        return (
            <Container>
                <div className='border border-light rounded p-3'>
                    <h3>
                        Modules
                    </h3>

                    <ListGroup>
                        <ListGroup.Item>
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">
                                    Pending...
                                </div>
                                Pending...
                            </div>
                        </ListGroup.Item>
                    </ListGroup>

                </div>
            </Container>
        )
    }
    return (
        <Container>
            <div className='border border-light rounded p-3'>
                <h3>
                    Modules
                </h3>
                <EditableModuleDisplay
                    modules={modules}
                    setModules={setModules}
                />
                <CreateModule
                    modules={modules}
                    setModules={setModules}
                />


            </div>
        </Container>
    )
}
export default ModulesView 