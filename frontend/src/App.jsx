
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// components
import SharedNavBar from './components/shared/SharedNavBar';
import SharedFooter from './components/shared/SharedFooter';

// routes
import HomePage from './components/pages/HomeAbout/HomePage';
import ModuleRouter from './routers/ModuleRouter';
import Login from './components/pages/Login/Login';
import ProtectedRoute from './routers/ProtectedRoute'

// contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

import UserGuideView from './components/pages/UserGuide/UserGuideView';

/**
 * `App` is the main component of the application, responsible for setting up the routing,
 * and providing shared layout components such as the navigation bar and footer. It uses
 * React Router to handle different routes and ensures protected routes are only accessible
 * to authenticated users. The component also integrates context providers for user authentication.
 *
 * @returns {React.ReactElement} The `App` component with routing, layout, and context providers.
 */
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
              element={<HomePage />} />
            {/* protected routes */}
            <Route path='/module/*'
              element={<ProtectedRoute element={<ModuleRouter />} />} />
            <Route exact path="/user-guide"
              element={<UserGuideView />} />

          </Routes>
        </div>
        <SharedFooter />
      </AuthProvider>
    </Router>
  )
}

export default App
