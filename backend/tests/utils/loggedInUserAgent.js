const request = require('supertest');
const createApp = require('../../app'); // Import your Express app

const app = createApp()

async function loginUser() {
    const response = await request(app)
        .post('/super_authentication/login') // Adjust the route to your actual login route
        .send({
            "email": "gt@email.com",
            "password": "sekret"
        });
        // console.log(response)
        console.log('login token: ',response.body.token)
    return response.body.token; // Adjust this to the actual structure of your response
}


async function getAuthenticatedAgent() {
    const token = await loginUser();
    const agent = request.agent(app);
    agent.set('Authorization', `Bearer ${token}`);
    return agent;
    // return request.agent(app).use((req) => {
    //     req.set('Authorization', `Bearer ${token}`);
    //     return req;
    // });
}

module.exports = {
    getAuthenticatedAgent
};