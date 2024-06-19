const express = require("express") // web server framework
const multer = require('multer') // middleware for handling file uploads and specifying destination directory
const path = require('path') // file and directory paths
const fs = require('fs') // used to delete and read files
const unzipper = require('unzipper') // used to unzip zip files
const { db, PORT, axios } = require('./routesCommonDependencies')
const cors = require('cors')

const app = express()
const upload = multer({ dest: 'uploads/' }); // destination directory...

const { verifyJwt } = require('./controllers/authenticationControllers')

app.use(express.json())
app.use(cors())

app.get('/test', async (req, res) => {
    // get from student
    const selectStudentQuery = 'SELECT * FROM student'
    const [studentRows] = await db.query(selectStudentQuery)
    return res.status(200).json(studentRows)
})

// protected routes
const fileSystemRoutes = require('./routes/fileSystemRoutes')
app.use('/file_system', verifyJwt, fileSystemRoutes)

const moduleRoutes = require('./routes/moduleRoutes')
app.use('/module', verifyJwt , moduleRoutes)

const aiModelRoutes = require('./routes/aiModelRoutes')
app.use('/ai_model',verifyJwt,  aiModelRoutes)

const superUserRoutes = require('./routes/superUserRoutes')
app.use('/super_user', verifyJwt,  superUserRoutes)

const studentRoutes = require('./routes/studentRoutes')
app.use('/student', verifyJwt, studentRoutes)


// unprotected login route
const authenticationRoutes = require('./routes/authenticationRoutes')
app.use('/super_authentication', authenticationRoutes)



// const examSubmissionRoutes;




app.listen(PORT, () => {
    console.log(`APP LISTENING ON ${PORT}`);
    console.log(`http://localhost:${PORT}`)
});