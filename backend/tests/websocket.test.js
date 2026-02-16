const io = require('socket.io-client');

describe('WebSocket Tests', () => {
    let clientSocket;
    
    beforeAll((done) => {
        clientSocket = io('http://localhost:3000', {
            auth: { token: 'valid-jwt-token' }
        });
        clientSocket.on('connect', done);
    });
    
    test('Deve receber mensagem enviada', (done) => {
        clientSocket.emit('join-chat', 'chat123');
        
        clientSocket.on('new-message', (message) => {
            expect(message).toHaveProperty('text');
            done();
        });
        
        clientSocket.emit('send-message', {
            chatId: 'chat123',
            text: 'Olá, preciso de ajuda'
        });
    });
    
    afterAll(() => {
        clientSocket.close();
    });
});