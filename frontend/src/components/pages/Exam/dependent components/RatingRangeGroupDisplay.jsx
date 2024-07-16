
import ListGroup from "react-bootstrap/ListGroup"

const RatingRangeGroupDisplay = ({ rating_ranges }) => {

    console.log('rating ranges',rating_ranges)

    return (

        <div className="d-flex justify-content-center">
            <ListGroup horizontal className="ms-auto me-auto">
                {rating_ranges.map((rating_range) =>
                    <ListGroup.Item key={rating_range.rating_range_id}>
                        <div className="d-flex flex-column">
                            <p>
                                <b>{rating_range.rating_min_incl}</b> to <b>{rating_range.rating_max_incl}</b>
                            </p>
                            <p>
                                {rating_range.rating_desc}
                            </p>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        </div>
    )



}



export default RatingRangeGroupDisplay