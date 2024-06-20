import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import {Link} from 'react-router-dom'

import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'

const EditableModuleDisplay = ({modules, setModules}) => {

    async function handleDeleteButtonClick(module_id, index){
        const deleteUrl = `${BASE_API_URL}module/${module_id}`
        const responseFromDelete = await axiosToBackend.delete(deleteUrl)
        console.log(responseFromDelete)

        if(responseFromDelete.status === 204){
            // do stuff
            let newModules = modules.slice(0,index).concat(modules.slice(index+1))
            setModules(newModules)
        } else{
            window.alert('Failed to delete module')
        }

    }

    return(

        <ListGroup>


                    {modules.map((module, index) =>

                        <ListGroup.Item key={module.module_id}
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">
                                    <Link to={`/module/${module.module_id}`}>{module.module_name}</Link>
                                </div>
                                {module.exams.map((exam) =>
                                    <li key={exam.exam_id}>
                                        <Link to={`/module/${module.module_id}/exam/${exam.exam_id}`}>{exam.exam_name}</Link>
                                    </li>

                                )}

                            </div>
                            <Button
                                variant="warning"
                                onClick={()=>{handleDeleteButtonClick(module.module_id, index)}}
                            >
                                Delete
                            </Button>
                        </ListGroup.Item>

                    )}
                </ListGroup>

    )

}

export default EditableModuleDisplay