
import { Row, Col } from "react-bootstrap"



const UGContentDisplay = ({ contentList }) => {



    return (
        <>
            {contentList.map((content, i) =>
                <Row key={i} className="my-2">
                    <Col>
                        <h3>
                            {content.title}
                        </h3>
                        {content.innerHTMLisActive ? <div>{content.body}</div> 
                        : <div> {content.body} </div> }

                    </Col>
                </Row>
            )}
        </>
    )

}


export default UGContentDisplay