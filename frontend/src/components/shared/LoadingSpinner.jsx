import { Spinner } from "react-bootstrap"


/**
 * `LoadingSpinner` is a functional component that displays a centered loading spinner.
 * It uses React Bootstrap's `Spinner` component to show a visual loading indicator.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {number} props.size - The size of the spinner, in rem units.
 * @returns {JSX.Element} The `LoadingSpinner` component.
 *
 * @example
 * // Usage with a spinner size of 2 rem
 * <LoadingSpinner size={2} />
 */
const LoadingSpinner = ({size}) => {

    return(<div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" role="status" style={{ width: `${size}rem`, height: `${size}rem` }}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
)

}


export default LoadingSpinner