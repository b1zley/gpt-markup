import {Route, Routes} from 'react-router-dom'

import ModuleView from '../components/pages/Module/ModuleView'
import ExamView from '../components/pages/Module/Exam/ExamView'

const ViewModulesPlaceHolder = () =>{



    return ('hello from modules placeholder')
}


const ModuleRouter = () =>{
    return (
        <Routes>
            <Route path='/' element={<ViewModulesPlaceHolder />}  />
            <Route path='/:module_id' element={<ModuleView loggedInSuperuser={{"super_user_id":1}}/>} />
            <Route path='/:module_id/exam/:exam_id' element={<ExamView />}/>
        </Routes>
    )
}

export default ModuleRouter