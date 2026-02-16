const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Chat API', () => {
    let token;
    
    beforeAll(async () => {
        // Login para obter token
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'cliente@teste.com',
                senha: '123456'
            });
        token = res.body.token;
    });
    
    test('Deve criar novo chat', async () => {
        const res = await request(app)
            .post('/api/chats')
            .set('Authorization', `Bearer ${token}`)
            .send({
                managerId: '507f1f77bcf86cd799439011',
                subject: 'investimentos'
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('chatId');
    });
    
    test('Deve listar chats do usuário', async () => {
        const res = await request(app)
            .get('/api/chats')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
});