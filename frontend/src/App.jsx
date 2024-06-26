
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'

// components
import SharedNavBar from './components/shared/SharedNavBar';
import SharedFooter from './components/shared/SharedFooter';

// routes
import Home from './components/pages/Home';
import AboutRouter from './routers/AboutRouter';
import CreateExam from './components/shared/CreateExam';
import ModuleView from './components/pages/Module/ModuleView'
import ModuleRouter from './routers/ModuleRouter';
import Login from './components/pages/Login/Login';
import ProtectedRoute from './routers/ProtectedRoute'

// contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';






const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SharedNavBar />
        <div className='my-3' style={{ 'minHeight': '77vh' }} >
          <Routes>
            {/* unprotected routes */}
            <Route path='/login'
              element={<Login />} />
            <Route exact path="/"
              element={<Home />} />
            {/* test route */}
            <Route path="/about/*"
              element={<AboutRouter />} />
            {/* protected routes */}
            <Route path='/create_exam'
              element={<CreateExam loggedInSuperUser={{ "super_user_id": 1 }} />} />
            <Route path='/module/*'
              element={<ProtectedRoute element={<ModuleRouter />} />} />
          </Routes>
        </div>
        <SharedFooter />
      </AuthProvider>
    </Router>


  )
}

export default App
