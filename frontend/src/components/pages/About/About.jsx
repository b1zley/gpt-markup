import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'


function About() {
  const someValuesToLink = [1,2]
  return (
    <Container>
      <h1>About Page</h1>
      <ul>
        {someValuesToLink.map((value) => 
            <li key={value}><Link to={`/about/${value}`}>{value}</Link></li>
        )}
      </ul>

    </Container>

  )
}

export default About;