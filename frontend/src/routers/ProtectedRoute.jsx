
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { Navigate } from 'react-router-dom'
const ProtectedRoute = ({ element, ...rest }) => {

    const { user, isLoading } = useAuth()
    console.log(user)

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