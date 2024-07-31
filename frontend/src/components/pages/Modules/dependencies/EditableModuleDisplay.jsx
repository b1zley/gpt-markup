import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import { Link } from 'react-router-dom'

import BASE_API_URL from '../../../../BASE_API_URL'
import axiosToBackend from '../../../../axiosToBackend'
import useConfirmation from '../../../hooks/useConfirmation'



/**
 * `EditableModuleDisplay` is a component that displays a list of modules with options to view and delete each module.
 * 
 * Each module is displayed in a list with its name and associated exams. Users can click on the module name or exam names to view their details. 
 * Additionally, each module has a "Delete" button that prompts for confirmation before performing the delete action.
 * 
 * @component
 * @param {Object[]} modules - Array of module objects to be displayed.
 * @param {Function} setModules - Function to update the list of modules.
 * @example
 * const [modules, setModules] = useState([]);
 * return <EditableModuleDisplay modules={modules} setModules={setModules} />;
 */
const EditableModuleDisplay = ({ modules, setModules }) => {

    const [confirm, ConfirmationModal] = useConfirmation()

    const DeleteModuleConfirmModal = ({ module }) => {

        return (
            <>
                <div>
                    Are you sure you want to delete:
                </div>
                <strong>{module.module_name}</strong>
                <div>
                    This action is irreversible!
                </div>
            </>
        )

    }

    async function handleDeleteButtonClick(module_id, index) {

        try {
            const confirmation = await confirm(<DeleteModuleConfirmModal module={modules[index]} />)
            if (!confirmation) {
                return
            }

            const deleteUrl = `${BASE_API_URL}module/${module_id}`
            const responseFromDelete = await axiosToBackend.delete(deleteUrl)
            console.log(responseFromDelete)

            if (responseFromDelete.status === 204) {
                // do stuff
                let newModules = modules.slice(0, index).concat(modules.slice(index + 1))
                setModules(newModules)
            }
        } catch (error) {
            await confirm('Failed to delete module')
        }

    }

    return (

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
                        onClick={() => { handleDeleteButtonClick(module.module_id, index) }}
                    >
                        Delete
                    </Button>
                </ListGroup.Item>

            )}
            <ConfirmationModal />
        </ListGroup>

    )

}

export default EditableModuleDisplay