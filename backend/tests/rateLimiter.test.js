const request = require('supertest');
const app = require('../server');

describe('Rate Limiting', () => {
    test('Deve bloquear após exceder limite de login', async () => {
        const loginData = {
            email: 'teste@teste.com',
            senha: 'senha_errada'
        };
        
        // Faz 5 tentativas (limite)
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post('/api/auth/login')
                .send(loginData);
        }
        
        // 6ª tentativa deve ser bloqueada
        const res = await request(app)
            .post('/api/auth/login')
            .send(loginData);
        
        expect(res.statusCode).toBe(429);
        expect(res.body).toHaveProperty('erro');
    });
});