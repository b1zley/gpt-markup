
import {Route, Routes} from 'react-router-dom'
import About from '../components/pages/About/About'
import AboutValue from '../components/pages/About/AboutValue'


/**
 * `AboutRouter` is a React component that defines routes related to the "About" section of the application.
 * It sets up routing for two pages:
 * - The main "About" page.
 * - A dynamic "AboutValue" page that displays content based on a URL parameter.
 * 
 * @returns {React.ReactElement} The `AboutRouter` component with its defined routes.
 */
const AboutRouter = () => {
    return (
        <Routes>
            
            <Route path='/' element={<About />} />
            <Route path='/:someValue' element={<AboutValue />} />
        </Routes>
    )
}

export default AboutRouter