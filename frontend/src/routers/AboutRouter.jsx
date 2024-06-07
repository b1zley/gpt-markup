
import {Route, Routes} from 'react-router-dom'
import About from '../components/pages/About/About'
import AboutValue from '../components/pages/About/AboutValue'

const AboutRouter = () => {
    return (
        <Routes>
            
            <Route path='/' element={<About />} />
            <Route path='/:someValue' element={<AboutValue />} />
        </Routes>
    )
}

export default AboutRouter