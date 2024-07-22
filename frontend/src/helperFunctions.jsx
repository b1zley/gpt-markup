function isValidNumber(input) {
    const regex = /^\d*\.?\d+$/
    return regex.test(input)
}


export default isValidNumber