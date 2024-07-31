

import { createContext, useState, useContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

import Cookies from 'js-cookie'

const AuthContext = createContext()

/**
 * `AuthProvider` is a React component that provides authentication context
 * to its children. It handles user authentication by managing a JWT token
 * and decoding it to obtain user information. The context includes functions
 * for logging in and out, as well as the current user's information and
 * a loading state.
 * 
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {React.ReactElement} The `AuthProvider` component.
 */
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isLoading, setLoading] = useState(true); 


    useEffect(()=>{
        const token = Cookies.get('jwt')
        if(token){
            const decodedToken = jwtDecode(token)
            setUser(decodedToken)
        }
        setLoading(false)


    }, [])

    const login = (token) => {
        // setUser(userData)
        console.log('token: ',token)
        const decodedToken = jwtDecode(token)
        setUser(decodedToken)
        Cookies.set('jwt', token, {expires: 7})
    }


    const logout = () => {
        setUser(null)
        Cookies.remove('jwt');
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )


}


export const useAuth = () => useContext(AuthContext)