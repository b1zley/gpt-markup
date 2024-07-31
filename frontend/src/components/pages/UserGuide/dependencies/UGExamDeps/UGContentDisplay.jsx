
import { Row, Col } from "react-bootstrap"



const UGContentDisplay = ({ contentList, innerHTMLisActive }) => {



    return (
        <>
            {contentList.map((content, i) =>
                <Row key={i}>
                    <Col>
                        <h3>
                            {content.title}
                        </h3>
                        {innerHTMLisActive ? <div dangerouslySetInnerHTML={{ __html: content.body }} /> 
                        : <p> {content.body} </p> }

                    </Col>
                </Row>
            )}
        </>
    )

}


export default UGContentDisplay