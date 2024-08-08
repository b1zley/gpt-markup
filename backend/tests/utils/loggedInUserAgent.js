const request = require('supertest');
const createApp = require('../../app'); 

const app = createApp()

async function loginUser() {
    const response = await request(app)
        .post('/super_authentication/login') 
        .send({
            "email": "gt@email.com",
            "password": "sekret"
        });
        console.log('login token: ',response.body.token)
    return response.body.token; 
}


async function getAuthenticatedAgent() {
    const token = await loginUser();
    const agent = request.agent(app);
    agent.set('Authorization', `Bearer ${token}`);
    return agent;
}

module.exports = {
    getAuthenticatedAgent
};