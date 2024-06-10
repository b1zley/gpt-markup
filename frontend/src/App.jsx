
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react'

// components
import SharedNavBar from './components/shared/SharedNavBar';
import SharedFooter from './components/shared/SharedFooter';

// routes
import Home from './components/pages/Home';
import AboutRouter from './routers/AboutRouter';
import CreateExam from './components/shared/CreateExam';
import ModuleView from './components/pages/Module/ModuleView'

const App = () => {
  return (
    <Router>
      <SharedNavBar />
      <div className='my-3' style={{ 'minHeight': '77vh' }} >

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about/*" element={<AboutRouter />} />
          <Route path='/create_exam' element={<CreateExam loggedInSuperUser={{"super_user_id":1}}/>} />
          <Route path='/module/:module_id' element={<ModuleView loggedInSuperuser={{"super_user_id":1}}/>} />
        </Routes>
      </div>
      <SharedFooter />
    </Router>


  )
}

export default App
