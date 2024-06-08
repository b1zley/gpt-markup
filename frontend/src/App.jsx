
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useState, useEffect} from 'react'

// components
import SharedNavBar from './components/shared/SharedNavBar';
import SharedFooter from './components/shared/SharedFooter';

// routes
import Home from './components/pages/Home';
import AboutRouter from './routers/AboutRouter';
import UploadExamInfo from './components/pages/UploadExamInfo';

const App = () => {


  const [responseFromUpload, setResponseFromUpload] = useState(null)

  useEffect(() => {
    console.log('Value of responseFromUpload:', responseFromUpload);
  });

  return (
    <Router>
      <SharedNavBar />
      <div className='my-3' style={{'minHeight':'77vh'}} >

        

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about/*" element={<AboutRouter />} />
          <Route path='/upload' element={<UploadExamInfo submissionType={'EXAM_SUBMISSION'} setResponseReturn={setResponseFromUpload} />} />

        </Routes>
      </div>
      <SharedFooter />
    </Router>


  )
}

export default App
