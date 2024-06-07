
const db = require('./dbConfig')
const PORT = 4000;
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const backendRoot = __dirname
const storageDirectory = backendRoot + process.env.STORAGE_DIRECTORY

// const API_KEY = process.env.API_KEY
// axios.defaults.headers.common['api-key'] = API_KEY;
module.exports =  {db, PORT, axios, backendRoot, storageDirectory} 