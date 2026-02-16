// Script de inicialização do MongoDB

db = db.getSiblingDB('banco_chat');

// Cria collections
db.createCollection('users');
db.createCollection('chats');
db.createCollection('messages');

// Índices para Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ tipo: 1 });
db.users.createIndex({ ativo: 1 });

// Índices para Chats
db.chats.createIndex({ clienteId: 1, status: 1 });
db.chats.createIndex({ gerenteId: 1, status: 1 });
db.chats.createIndex({ criadoEm: -1 });
db.chats.createIndex({ status: 1, prioridade: 1 });

// Índices para Messages
db.messages.createIndex({ chatId: 1, criadoEm: -1 });
db.messages.createIndex({ userId: 1 });
db.messages.createIndex({ lida: 1 });
// TTL index - Remove mensagens após 90 dias
db.messages.createIndex({ criadoEm: 1 }, { expireAfterSeconds: 7776000 });

// Cria usuário admin inicial (opcional)
db.users.insertOne({
    nome: "Administrador",
    email: "admin@banco.com",
    senha: "$2a$10$XqW8JYHzO.0bVr5xQPIxUOPDWJvQ7j4xvKm9PJY0QKJvLZD5bZD5G", // senha: admin123
    tipo: "admin",
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date()
});

print('✅ Banco de dados inicializado com sucesso!');