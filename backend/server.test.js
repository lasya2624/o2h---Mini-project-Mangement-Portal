const request = require('supertest');
const app = require('./server');
const db = require('./db');

describe('Task API', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Need to wait a moment for the async DB initialization to finish inside db.js
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear tables
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE tasks');
        await db.execute('TRUNCATE TABLE users');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        // Create a test user
        const resReg = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'password123' });
        
        userId = resReg.body.id;

        // Login to get token
        const resLogin = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });
        
        token = resLogin.body.token;
    });

    afterAll(async () => {
        await db.end();
    });

    let taskId;

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'This is a test description with more than 20 characters.'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toEqual('Test Task');
        expect(res.body.status).toEqual('Pending');
        taskId = res.body.id;
    });

    it('should fetch tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update a task status to completed', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Completed' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('Completed');
    });

    it('should fetch dashboard stats', async () => {
        const res = await request(app)
            .get('/api/tasks/stats')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('completed');
        expect(res.body).toHaveProperty('pending');
    });

    it('should delete a task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Task deleted successfully');
    });
});
