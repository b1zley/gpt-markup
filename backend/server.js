const createApp = require('./app');
const { PORT } = require('./routesCommonDependencies');

const app = createApp()

app.listen(PORT, () => {
    console.log(`APP LISTENING ON ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
