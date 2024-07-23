const { db } = require('../../routesCommonDependencies');

module.exports = async () => {
    try {
        console.log('we are in teardown :)')
        await db.end();
    } catch (err) {
        console.log(err)
        console.log('here be errors')
    }

};