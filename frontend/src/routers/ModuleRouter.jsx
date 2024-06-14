import {Route, Routes} from 'react-router-dom'

import ModuleView from '../components/pages/Module/ModuleView'
import ExamView from '../components/pages/Module/Exam/ExamView'
import RubricComponentView from '../components/pages/Module/Exam/Rubric_component/RubricComponentView'

const ViewModulesPlaceHolder = () =>{



    return ('hello from modules placeholder')
}


const ModuleRouter = () =>{
    return (
        <Routes>
            <Route path='/' element={<ViewModulesPlaceHolder />}  />
            <Route path='/:module_id' element={<ModuleView loggedInSuperuser={{"super_user_id":1}}/>} />
            <Route path='/:module_id/exam/:exam_id' element={<ExamView />}/>
            <Route path='/:module_id/exam/:exam_id/rubric_component/:rubric_component_id' element={<RubricComponentView />} />
        </Routes>
    )
}

export default ModuleRouter