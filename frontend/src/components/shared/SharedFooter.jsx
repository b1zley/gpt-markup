import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * `SharedFooter` is a functional component that renders a footer section for the application.
 * It provides a consistent footer layout with minimal content and styling.
 *
 * @component
 * @returns {JSX.Element} The `SharedFooter` component.
 *
 * @example
 * <SharedFooter />
 */
const SharedFooter = () => {

    const myName = `Dr Joshua O'Hagan`
    const myUniversity = `Queen's University Belfast`
    const myEmail = `johagan21@qub.ac.uk`

    return (
        <footer className="footer bg-light text-secondary mt-auto py-4">
            <Container>
                <Row className="text-center">
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>About</h5>
                        <p>Created by {myName} at {myUniversity}.</p>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>Contact</h5>
                        <div>Email: {myEmail}</div>
                        <div>Phone: +123 456 7890</div>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>Follow Us</h5>
                        <a href="https://github.com/b1zley/" className="text-secondary me-2" aria-label="Twitter">
                            <i className="bi bi-twitter"></i> GitHub
                        </a>
                        <br />
                        <a href="https://www.linkedin.com/in/joshua-o-hagan-b288b414b/" className="text-secondary" aria-label="LinkedIn">
                            <i className="bi bi-linkedin"></i> LinkedIn
                        </a>
                    </Col>
                </Row>
                <Row className='my-2'>
                    <Col className="text-center">
                        <span className="text-muted">&copy; {new Date().getFullYear()} {myName} | {myUniversity}. All rights reserved.</span>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default SharedFooter;
