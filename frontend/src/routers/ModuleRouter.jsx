import {Route, Routes} from 'react-router-dom'

import ModuleView from '../components/pages/Module/ModuleView'
import ExamView from '../components/pages/Exam/ExamView'
import RubricComponentView from '../components/pages/Rubric_component/RubricComponentView'
import StudentExamSubmissionView from '../components/pages/StudentExamSubmission/StudentExamSubmissionView'
import ModulesView from '../components/pages/Modules/ModulesView'


/**
 * `ModuleRouter` is a React component that manages routing for the module-related pages of the application.
 * It sets up routes for viewing modules, exams, rubric components, and student exam submissions.
 * 
 * @returns {React.ReactElement} The `ModuleRouter` component with its defined routes.
 */
const ModuleRouter = () =>{
    return (
        <Routes>
            <Route path='/' element={<ModulesView />}  />
            <Route path='/:module_id' element={<ModuleView />} />
            <Route path='/:module_id/exam/:exam_id' element={<ExamView />}/>
            <Route path='/:module_id/exam/:exam_id/rubric_component/:rubric_component_id' element={<RubricComponentView />} />
            <Route path='/:module_id/exam/:exam_id/student_exam_submission/:student_exam_submission_id' element={<StudentExamSubmissionView />}/>
        </Routes>
    )
}

export default ModuleRouter