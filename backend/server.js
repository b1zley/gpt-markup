const dotenv = require('dotenv');
dotenv.config();
// console.log('Loaded environment variables:', process.env);
const createApp = require('./app');
// console.log('DB_USER:', process.env.DB_USER); // Should output 'root'

const { PORT } = require('./routesCommonDependencies');

const app = createApp()

app.listen(PORT, () => {
    console.log(`APP LISTENING ON ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
