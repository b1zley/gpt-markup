const mysql = require('mysql2/promise')

// const dotenv = require('dotenv');
// dotenv.config();



const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME;
const DB_PORT = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_PORT : process.env.DB_PORT;
const DB_HOST = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST;
const DB_USER = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_USER : process.env.DB_USER;
const DB_PASSWORD = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD;


const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

module.exports = db