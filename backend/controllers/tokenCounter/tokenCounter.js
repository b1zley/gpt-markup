
const { encode } = require('gpt-3-encoder')

const {fullMinifyCode} = require('../codeMinifier/minifier')

function countTokens(inputString) {
    const encoded = encode(inputString)
    return encoded.length
}


// const someCode = ``

// console.log('raw')
// console.log(countTokens(someCode))

// console.log('minified')
// console.log(countTokens(fullMinifyCode(someCode)))



module.exports = { countTokens }