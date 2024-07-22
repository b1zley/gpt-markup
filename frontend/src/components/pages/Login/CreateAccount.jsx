

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import useConfirmation from '../../hooks/useConfirmation'
import BASE_API_URL from '../../../BASE_API_URL'
import axiosToBackend from '../../../axiosToBackend'
import { useAuth } from '../../../contexts/AuthContext'

const CreateAccount = () => {


    const { login } = useAuth()

    const [confirm, ConfirmationModal] = useConfirmation()

    const [emailInput, setEmailInput] = useState('')
    const [nameInput, setNameInput] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [accountCreationCode, setAccountCreationCode] = useState('')


    function passwordsMatch() {
        return password1 === password2
    }

    function allFieldsHaveValues() {
        return !!emailInput && !!password1 && !!password2 && !!accountCreationCode
    }

    async function submitAccountCreation(event) {
        event.preventDefault()
        console.log('hello from submit account creation')

        // validate fields
        if (!allFieldsHaveValues()) {
            return await confirm('Please fill in all fields to continue...')
        }

        // validate match
        if (!passwordsMatch()) {
            return await confirm('Passwords do not match...')
        }

        const postBody = {
            email: emailInput,
            name: nameInput,
            password: password1,
            accountCreationCode
        }

        const postUrl = `${BASE_API_URL}super_authentication/create`

        const response = await axiosToBackend.post(postUrl, postBody)

        console.log(response)

        const token = response.data.token
        login(token)

    }

    return (

        <>
            <ConfirmationModal />
            <div className='border border-light rounded p-3 my-2'>
                <h3>Create Account</h3>

                <Form onSubmit={(event) => submitAccountCreation(event)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={emailInput}
                            onChange={(event) => setEmailInput(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={nameInput}
                            onChange={(event) => setNameInput(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password1}
                            onChange={(event) => setPassword1(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password2}
                            onChange={(event) => setPassword2(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Account Creation Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter account creation code"
                            value={accountCreationCode}
                            onChange={(event) => setAccountCreationCode(event.target.value)}
                        />
                    </Form.Group>
                    <Button type='submit'>
                        Create Account
                    </Button>
                </Form>


            </div>
        </>

    )

}


export default CreateAccount