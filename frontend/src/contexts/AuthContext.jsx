

import { createContext, useState, useContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

import Cookies from 'js-cookie'

const AuthContext = createContext()


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