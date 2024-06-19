const { response } = require('express');
const { db, axios, backendRoot, storageDirectory } = require('../routesCommonDependencies'); // Common dependencies

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET
// request handlers

async function handlePostCreateNewUser(req, res) {

    try {
        const { email, name, password, super_user_type_id } = req.body
        const createdUser = await queryCreateUser(email, name, password, super_user_type_id)
        // handle jwt creation now
        const jwtToReturn = await createJwt(createdUser)
        return res.status(201).json({ token: jwtToReturn, user: createdUser })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

async function handlePostLogin(req, res) {

    try{
        const {email, password} = req.body
        const user = await queryLogin(email, password)
        const jwtToReturn = await createJwt(user)
        return res.status(200).json({token: jwtToReturn, user})
    } catch (err){
        console.log(err)
        return res.status(500).send()
    }


}


// JWT verification middleware
function verifyJwt(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Split the header to get the token
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Malformed token' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded; // Attach the decoded payload to req.user
        next();
    });
}


// query functions

async function queryCreateUser(email, name, password, super_user_type_id) {
    // validate email not present
    if (await queryIsEmailPresent(email)) {
        console.log('hello what?')
        throw new Error('Email already in use')
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const sqlInsertQuery = "INSERT INTO `super_user` (`super_user_id`, `super_user_name`, `super_user_type_id`, `super_user_password`, `super_user_email`) VALUES (NULL, ?, ?, ?, ?);"
    const bindingParams = [name, super_user_type_id, hashedPassword, email]
    const [responseFromInsert] = await db.query(sqlInsertQuery, bindingParams)
    let returnObject = {
        super_user_id: responseFromInsert.insertId,
        name,
        email
    }
    return returnObject
}


async function queryIsEmailPresent(email) {
    const sqlQuery = "SELECT * FROM super_user WHERE super_user_email = ?"
    const bindingParams = [email]
    const [responseFromQuery] = await db.query(sqlQuery, bindingParams)
    return responseFromQuery.length > 0
}

async function createJwt(user) {
    const payload = user
    const options = { expiresIn: '1h' }
    const token = jwt.sign(payload, secretKey, options)
    return token
}


async function queryLogin(email, password){
    const user = await queryGetUserByEmail(email)
    if(!user){
        throw new Error('email or password invalid')
    }
    const isPasswordValid = await bcrypt.compare(password, user.super_user_password)
    if(!isPasswordValid){
        throw new Error('email or password invalid')
    }
    const {super_user_id, super_user_name, super_user_type, super_user_email} = user
    const userToReturn = {super_user_id, super_user_name, super_user_type, super_user_email}
    return userToReturn
}


async function queryGetUserByEmail(email){
    const sqlQuery = "SELECT * FROM super_user WHERE super_user_email = ?"
    const bindingParams = [email]
    const [responseFromQuery] = await db.query(sqlQuery, bindingParams)
    return responseFromQuery[0]
}







module.exports = {
    handlePostCreateNewUser,
    handlePostLogin,
    verifyJwt
}