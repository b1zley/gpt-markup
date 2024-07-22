import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';

import logoImage from '../../assets/img/ChatGPT_logo.svg.png';
import { useAuth } from '../../contexts/AuthContext';

import { useNavigate } from 'react-router-dom'

function SharedNavBar({ logoImageSrc = logoImage, brandName = 'MarkUp-GPT' }) {


  const { login, user, logout } = useAuth()
  const navigate = useNavigate()



  async function handleLogout() {
    logout()
    navigate('/login')
  }


  return (
    <Navbar expand="lg" style={{ 'minHeight': '10vh' }} className="bg-light">
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand href="">
            <div className='d-flex align-items-center'>
              <img
                src={logoImageSrc}
                width="50"
                height="50"
                className="d-inline-block align-top me-2"
                alt="React Bootstrap logo"
              />
              <h3>
                {brandName}
              </h3>
            </div>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to='/'>
              <Nav.Link className='mx-2 '>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/about'>
              <Nav.Link className='mx-2 '>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/module'>
              <Nav.Link className='mx-2 '>Modules</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav className='ms-auto'>
            <NavDropdown className='mx-2 ' style={{ 'padding': '0' }} title="Account" id="basic-nav-dropdown">

              {user ?
                <NavDropdown.Item style={{ 'width': '100%' }} onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
                :
                <LinkContainer to='/login'>
                  <NavDropdown.Item style={{ 'width': '100%' }}>
                    Login
                  </NavDropdown.Item>
                </LinkContainer>
              }

            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SharedNavBar;
