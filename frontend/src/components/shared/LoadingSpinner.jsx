import { Spinner } from "react-bootstrap"

const LoadingSpinner = ({size}) => {

    return(<div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" role="status" style={{ width: `${size}rem`, height: `${size}rem` }}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
)

}


export default LoadingSpinner