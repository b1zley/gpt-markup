const express = require("express") // web server framework
const multer = require('multer') // middleware for handling file uploads and specifying destination directory
const path = require('path') // file and directory paths
const fs = require('fs').promises // used to delete and read files
const createReadStream = require('fs').createReadStream;
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
app.use('/module', verifyJwt, moduleRoutes)

const aiModelRoutes = require('./routes/aiModelRoutes')
app.use('/ai_model', verifyJwt, aiModelRoutes)

const superUserRoutes = require('./routes/superUserRoutes')
app.use('/super_user', verifyJwt, superUserRoutes)

const studentRoutes = require('./routes/studentRoutes')
app.use('/student', verifyJwt, studentRoutes)


const decodeRTFRoutes = require('./routes/decodeRTFRoutes')
app.use('/convert', verifyJwt, decodeRTFRoutes)


// unprotected login route
const authenticationRoutes = require('./routes/authenticationRoutes')
app.use('/super_authentication', authenticationRoutes)



// app.use('/files', express.static(path.join(__dirname, 'uploads')));

app.get('/files/:path?', async (req, res) => {

    try {
        const basePath = path.join(__dirname, 'uploads');

        let pathParam = req.params.path

        // handle null on pathParam
        if (!pathParam) {
            pathParam = ''
        }
        const replacedPath = pathParam.replace(/x--x/g, '/');

        // create request path
        const requestedPath = replacedPath ? path.join(basePath, replacedPath) : basePath;


        // check if request path is directory
        const stats = await fs.stat(requestedPath);
        if (stats.isDirectory()) {
            // if directory - do this stuff
            const files = await fs.readdir(requestedPath, { withFileTypes: true });

            const fileList = files.map(file => ({
                name: file.name,
                isDirectory: file.isDirectory()
            }));

            return res.json(fileList);
        } else {
            // its a file, we want to send it to the client
            await fs.access(requestedPath, fs.constants.R_OK)

            const fileContent = await fs.readFile(requestedPath)
            res.send(fileContent)
        }
    } catch (err) {
        return res.status(500)
    }




});


// const examSubmissionRoutes;




app.listen(PORT, () => {
    console.log(`APP LISTENING ON ${PORT}`);
    console.log(`http://localhost:${PORT}`)
});