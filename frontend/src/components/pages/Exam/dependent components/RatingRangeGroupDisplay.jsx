
import ListGroup from "react-bootstrap/ListGroup"


/**
 * Displays a horizontal list of rating ranges, including their minimum and maximum values and descriptions.
 * 
 * @component
 * @example
 * ```jsx
 * const ratingRanges = [
 *   { rating_range_id: 1, rating_min_incl: 0, rating_max_incl: 10, rating_desc: "Poor" },
 *   { rating_range_id: 2, rating_min_incl: 11, rating_max_incl: 20, rating_desc: "Average" },
 *   { rating_range_id: 3, rating_min_incl: 21, rating_max_incl: 30, rating_desc: "Good" }
 * ];
 * 
 * <RatingRangeGroupDisplay rating_ranges={ratingRanges} />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.rating_ranges - Array of rating range objects, each containing `rating_range_id`, `rating_min_incl`, `rating_max_incl`, and `rating_desc`.
 * 
 * @returns {React.Element} The rendered component.
 */
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