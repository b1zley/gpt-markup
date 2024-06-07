import { Container } from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'



const AboutValue = () => {

    const {someValue} = useParams()


    return (

        <>
        <Container>
            <h1>
                About Page
            </h1>
            <p>
                Param Value: {someValue}
            </p>
            <Link to='/about'>
                Return
            </Link>
        </Container>
        
        </>

    )


}

export default AboutValue