import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function ImageFragment({ imageSource }) {
    return (
        <Col xs='12' lg='6' className='justify-content-center d-flex my-2' style={{ 'maxHeight': `100%`, 'maxWidth': '100%' }}>
            <img className='img-fluid rounded' style={{ 'maxHeight': `100%`, 'maxWidth': '100%' }} src={imageSource} alt="" />

        </Col>
    )
}

function TextFragment({ textTitle, textBody }) {
    return (
        <Col xs='12' lg='6' style={{ 'maxHeight': `100%`, 'maxWidth': '100%' }} className='my-2 d-flex flex-column justify-content-center '>
            <h3>
                {textTitle}
            </h3>
            <p>
                {textBody}
            </p>
        </Col>
    )
}


function ImageContentPair({ imageSource, textTitle, textBody, imageLeft }) {

    const maxPairHeight = '250px'

    if (imageLeft) {
        return (
            <>
                <Container>
                    <Row className='justify-content-center my-2' style={{}}>
                        <ImageFragment imageSource={imageSource} />
                        <TextFragment textTitle={textTitle} textBody={textBody} />
                    </Row>
                </Container>

            </>
        )
    } else {
        return (
            <>
                <Container>
                    <Row className='justify-content-center my-2' style={{}}>
                        <TextFragment textTitle={textTitle} textBody={textBody} />
                        <ImageFragment imageSource={imageSource} />
                    </Row>
                </Container>

            </>
        )
    }

}

export default ImageContentPair