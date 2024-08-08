
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { Navigate } from 'react-router-dom'


/**
 * `ProtectedRoute` is a React component that conditionally renders the provided `element`
 * based on the user's authentication status. It ensures that only authenticated users
 * can access certain routes. If the authentication status is being loaded, a loading spinner
 * is displayed. If the user is not authenticated, they are redirected to the login page.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactElement} props.element - The React element to render if the user is authenticated.
 * @param {Object} [props.rest] - Additional properties passed to the component.
 * @param {string} [props.rest.location] - The location from which the user was redirected (for navigation state).
 *
 * @returns {React.ReactElement} The `ProtectedRoute` component. Renders the `element` if the user is authenticated,
 * or redirects to the login page if the user is not authenticated.
 */
const ProtectedRoute = ({ element, ...rest }) => {

    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return user ? (
        element
    ) : (
        <Navigate to="/login" state={{ from: rest.location }} replace />
    )
}

export default ProtectedRoute