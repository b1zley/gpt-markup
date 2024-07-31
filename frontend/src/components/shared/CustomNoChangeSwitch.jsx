

import '../../scss/switchOverride.css'

import Form from 'react-bootstrap/Form'


import { useState } from 'react'

/**
 * `CustomNoChangeSwitch` is a functional component that renders a custom switch control. It toggles its checked state when clicked and calls a provided `handleToggle` function.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {Function} props.handleToggle - A function to be called when the switch is toggled. This function should be asynchronous.
 * @param {boolean} props.initial - The initial checked state of the switch.
 * @returns {JSX.Element} The `CustomNoChangeSwitch` component.
 *
 * @example
 * // Usage of the CustomNoChangeSwitch component
 * const handleSwitchToggle = async () => {
 *   // Logic for handling the switch toggle
 *   console.log('Switch toggled');
 * };
 *
 * <CustomNoChangeSwitch
 *   handleToggle={handleSwitchToggle}
 *   initial={false}
 * />
 */
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