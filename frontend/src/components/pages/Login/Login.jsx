
import { useEffect, useState } from 'react'



import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


import BASE_API_URL from '../../../BASE_API_URL'


import axios from 'axios'

import { useAuth } from '../../../contexts/AuthContext'
import CreateAccount from './CreateAccount'



/**
 * The `Login` component handles user authentication.
 * It provides a form for users to log in and displays a message if the user is already logged in.
 * 
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
const Login = () => {


    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')

    const { login, user, logout } = useAuth()


    async function handleSubmit(event) {
        event.preventDefault()
        const postBody = {
            email: emailInput,
            password: passwordInput
        }
        const postUrl = `${BASE_API_URL}super_authentication/login`

        const responseFromLogin = await axios.post(postUrl, postBody)
        console.log(responseFromLogin)
        console.log(responseFromLogin.data)
        const token = responseFromLogin.data.token
        login(token)
    }

    if(user){
        return(
            <Container>
            <div className='border border-light rounded p-3'>
                <h3>Successfully logged in as: {user.super_user_name } </h3>
                <Button onClick={() => {logout()}}>
                    Log out
                </Button>
            </div>
        </Container>
        )
    }


    return (
        <Container>
            <div className='border border-light rounded p-3'>
                <h3>Login</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            id='loginEmail'
                            value={emailInput}
                            onChange={(event) => setEmailInput(event.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            id='loginPassword'
                            value={passwordInput}
                            onChange={(event) => setPasswordInput(event.target.value)}
                        />
                    </Form.Group>
                    <Button type='submit' id='loginSubmitButton'>
                        Login
                    </Button>
                </Form>
            </div>

            <CreateAccount />
        </Container>
    )

}


export default Login