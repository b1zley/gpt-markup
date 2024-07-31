import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import loremIpsumMarketingImage from '../../../assets/img/marketingloremipsum.png';
import ImageContentPair from '../../home/ImageContentPair';

import { Link } from 'react-router-dom';

/**
 * HomePage Component
 * 
 * This component provides an overview of the functionalities available within the website,
 * including a dedicated section for the flagship AI Marking Generation feature and other features
 * described in uniform cards.
 * 
 * @returns {React.ReactElement} The HomePage component with a flagship feature and additional functionality descriptions.
 */
const HomePage = () => {
    return (
        <Container className="my-4">
            {/* Flagship Feature Section */}
            <Row className="text-center mb-4">
                <Col>
                    <h1>Welcome to MarkUp-GPT</h1>
                    <p>Discover the powerful features and tools available at your fingertips.</p>
                </Col>
            </Row>

            <hr className='divider' />
            <Row className="my-4">
                <Col>
                    <ImageContentPair
                        imageSource={loremIpsumMarketingImage}
                        textTitle="AI Marking Generation"
                        textBody={`Experience the cutting-edge AI Marking Generation technology that revolutionizes the way exams are graded.
                                Our AI-driven solution assists in evaluating and marking exams with unparalleled accuracy and efficiency.
                                It helps streamline the grading process, saving time and ensuring consistency in evaluations.`}
                        imageLeft={true} />
                </Col>
            </Row>
            <hr className='divider' />

            {/* Other Features Section */}
            <Row>
                {[
                    {
                        title: 'Manage Exams',
                        description: 'Easily create and manage exams for your courses. Select a module and provide the exam name to get started.',
                    },
                    {
                        title: 'Manage Modules',
                        description: 'Browse and manage your modules. Access detailed views of each module and explore related exams and submissions.',
                    },
                    {
                        title: 'File Viewer',
                        description: 'Access and view files related to exams and submissions. Utilize the file browser to manage and review content.',
                    },
                    {
                        title: 'Rubric Management',
                        description: 'Manage and configure rubrics for evaluating exams. Customize criteria and scoring to fit various assessment needs.',
                    },
                    {
                        title: 'Exam Submission Tracking',
                        description: 'Keep track of all exam submissions with ease. Monitor submission statuses and ensure timely evaluations.',
                    },
                    {
                        title: 'Feedback and Comments',
                        description: 'Provide and manage feedback on exams and submissions. Engage with students through comments and suggestions.',
                    },
                ].map((card, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card style={{ height: '100%' }} className="shadow-sm">
                            <Card.Body>
                                <Card.Title>{card.title}</Card.Title>
                                <Card.Text>{card.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <hr className='divider' />
            {/* User Guide Section */}
            <Row className="text-center mt-4">
                <Col>
                    <h2>Explore Our User Guide</h2>
                    <p>For a detailed overview of all features and functionalities, as well as step-by-step instructions on how to use them, please refer to our comprehensive user guide.</p>
                    <Link to={`/user-guide`}>
                        <Button variant="primary"  className="my-3">
                            View our User Guide
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;