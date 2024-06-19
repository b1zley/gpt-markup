

import { createContext, useState, useContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isLoading, setLoading] = useState(true); 


    useEffect(()=>{
        const token = localStorage.getItem('jwt')
        if(token){
            const decodedToken = jwtDecode(token)
            setUser(decodedToken)
        }
        setLoading(false)


    }, [])

    const login = (token) => {
        // setUser(userData)
        const decodedToken = jwtDecode(token)
        setUser(decodedToken)
        localStorage.setItem('jwt', token)
    }


    const logout = () => {
        setUser(null)
        localStorage.removeItem('jwt')
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )


}


export const useAuth = () => useContext(AuthContext)