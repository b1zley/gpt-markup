

import '../../scss/switchOverride.css'

import Form from 'react-bootstrap/Form'


import { useState } from 'react'


const CustomNoChangeSwitch = ({ handleToggle, initial }) => {


    const [isChecked, setIsChecked] = useState(initial)


    const toggleFunction = async () => {
        try {
            await handleToggle()
            setIsChecked(!isChecked)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                className="my-2 custom-switch"
                checked={isChecked}
                onChange={toggleFunction}

            />
        </>
    )

}

export default CustomNoChangeSwitch