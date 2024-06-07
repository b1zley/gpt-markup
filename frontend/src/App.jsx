
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// components
import SharedNavBar from './components/shared/SharedNavBar';
import SharedFooter from './components/shared/SharedFooter';

// routes
import Home from './components/pages/Home';
import AboutRouter from './routers/AboutRouter';

const App = () => {
  return (
    <Router>
      <SharedNavBar />
      <div className='my-3' style={{'minHeight':'77vh'}} >

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about/*" element={<AboutRouter />} />

        </Routes>
      </div>
      <SharedFooter />
    </Router>


  )
}

export default App
