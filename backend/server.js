require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Importa configurações
const connectDB = require('./config/database');
const configurarSwagger = require('./config/swagger');

// Importa middlewares
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { limiterGeral, limiterDocs, logBloqueio } = require('./middlewares/rateLimiter');

// Importa rotas
const rotasAuth = require('./routes/auth');
const rotasChats = require('./routes/chats');

// Importa services
const { configurarWebSocket } = require('./services/websocket');

// Inicializa app
const app = express();
const server = http.createServer(app);

// Configura Socket.io
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        credentials: true,
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES GLOBAIS
// ========================================

// Segurança
app.use(helmet({
    contentSecurityPolicy: false, // Desabilita para Swagger funcionar
    crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logs (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Compressão de respostas
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sessões
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/banco_chat',
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SESSION_SECRET || 'sua-chave-secreta-aqui'
        }
    }),
    cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// Rate limiting com log de bloqueios
app.use(logBloqueio);

// ========================================
// CONECTA BANCO DE DADOS
// ========================================
connectDB();

// ========================================
// CONFIGURA WEBSOCKET
// ========================================
configurarWebSocket(io);

// Disponibiliza io para as rotas
app.set('io', io);

// ========================================
// DOCUMENTAÇÃO SWAGGER
// ========================================
configurarSwagger(app);
app.use('/api-docs', limiterDocs);

// ========================================
// ROTAS
// ========================================

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Comunicação Bancária',
        versao: '1.0.0',
        status: 'online',
        documentacao: `${req.protocol}://${req.get('host')}/api-docs`,
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            chats: '/api/chats'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Rotas da API (com rate limiting geral)
app.use('/api/auth', limiterGeral, rotasAuth);
app.use('/api/chats', limiterGeral, rotasChats);

// ========================================
// TRATAMENTO DE ERROS
// ========================================

// Rota não encontrada
app.use(notFound);

// Handler de erros global
app.use(errorHandler);

// ========================================
// INICIA SERVIDOR
// ========================================
server.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Servidor rodando!');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 WebSocket: ativo`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ========================================
// TRATAMENTO DE ERROS DO PROCESSO
// ========================================

process.on('unhandledRejection', (err) => {
    console.error('❌ Erro não tratado (Promise Rejection):', err);
    console.error('🔄 Encerrando servidor gracefully...');
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.error('❌ Erro não capturado (Exception):', err);
    console.error('🔄 Encerrando servidor gracefully...');
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('📥 SIGTERM recebido. Encerrando servidor gracefully...');
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('📥 SIGINT recebido. Encerrando servidor gracefully...');
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

module.exports = { app, server, io };