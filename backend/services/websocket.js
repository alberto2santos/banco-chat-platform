const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

// Armazena usuários conectados
const usuariosOnline = new Map();

/**
 * Configura WebSocket
 */
const configurarWebSocket = (io) => {
    // Middleware de autenticação
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error('Token não fornecido'));
            }
            
            // Verifica token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Busca usuário
            const usuario = await User.findById(decoded.id);
            
            if (!usuario || !usuario.ativo) {
                return next(new Error('Usuário inválido'));
            }
            
            socket.userId = usuario._id.toString();
            socket.usuario = usuario;
            next();
            
        } catch (error) {
            console.error('Erro na autenticação WebSocket:', error);
            next(new Error('Autenticação falhou'));
        }
    });
    
    // Conexão estabelecida
    io.on('connection', (socket) => {
        console.log(`✅ Cliente conectado: ${socket.userId} (${socket.usuario.nome})`);
        
        // Adiciona à lista de online
        usuariosOnline.set(socket.userId, {
            socketId: socket.id,
            nome: socket.usuario.nome,
            tipo: socket.usuario.tipo,
            conectadoEm: new Date()
        });
        
        // Notifica todos sobre novo usuário online
        io.emit('usuario-online', {
            userId: socket.userId,
            nome: socket.usuario.nome,
            tipo: socket.usuario.tipo
        });
        
        // Entra em sala de chat
        socket.on('entrar-chat', async (chatId) => {
            try {
                // Verifica se chat existe e usuário tem permissão
                const chat = await Chat.findById(chatId);
                
                if (!chat) {
                    return socket.emit('erro', { mensagem: 'Chat não encontrado' });
                }
                
                const userId = socket.userId;
                const clienteId = chat.clienteId.toString();
                const gerenteId = chat.gerenteId.toString();
                
                if (userId !== clienteId && userId !== gerenteId) {
                    return socket.emit('erro', { mensagem: 'Acesso negado' });
                }
                
                // Entra na sala
                socket.join(chatId);
                console.log(`👤 ${socket.usuario.nome} entrou no chat ${chatId}`);
                
                // Notifica outros usuários na sala
                socket.to(chatId).emit('usuario-entrou', {
                    userId: socket.userId,
                    nome: socket.usuario.nome,
                    chatId
                });
                
                // Confirma entrada
                socket.emit('chat-entrada-confirmada', { chatId });
                
            } catch (error) {
                console.error('Erro ao entrar no chat:', error);
                socket.emit('erro', { mensagem: 'Erro ao entrar no chat' });
            }
        });
        
        // Sai de sala de chat
        socket.on('sair-chat', (chatId) => {
            socket.leave(chatId);
            console.log(`👋 ${socket.usuario.nome} saiu do chat ${chatId}`);
            
            socket.to(chatId).emit('usuario-saiu', {
                userId: socket.userId,
                nome: socket.usuario.nome,
                chatId
            });
        });
        
        // Envia mensagem
        socket.on('enviar-mensagem', async (data) => {
            try {
                const { chatId, texto } = data;
                
                // Valida dados
                if (!chatId || !texto || texto.trim().length === 0) {
                    return socket.emit('erro', { mensagem: 'Dados inválidos' });
                }
                
                // Verifica permissão
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    return socket.emit('erro', { mensagem: 'Chat não encontrado' });
                }
                
                const userId = socket.userId;
                const clienteId = chat.clienteId.toString();
                const gerenteId = chat.gerenteId.toString();
                
                if (userId !== clienteId && userId !== gerenteId) {
                    return socket.emit('erro', { mensagem: 'Acesso negado' });
                }
                
                // Cria mensagem no banco
                const mensagem = await Message.create({
                    chatId,
                    userId: socket.userId,
                    texto: texto.trim(),
                    tipo: 'texto',
                    lida: false
                });
                
                // Popula dados do usuário
                await mensagem.populate('userId', 'nome avatar tipo');
                
                // Atualiza timestamp do chat
                chat.atualizadoEm = new Date();
                if (chat.status === 'aberto') {
                    chat.status = 'em_atendimento';
                }
                await chat.save();
                
                // Envia para todos na sala
                io.to(chatId).emit('nova-mensagem', {
                    mensagem: {
                        _id: mensagem._id,
                        chatId: mensagem.chatId,
                        userId: mensagem.userId._id,
                        nome: mensagem.userId.nome,
                        avatar: mensagem.userId.avatar,
                        tipo: mensagem.userId.tipo,
                        texto: mensagem.texto,
                        tipoMensagem: mensagem.tipo,
                        lida: mensagem.lida,
                        criadoEm: mensagem.criadoEm
                    }
                });
                
                console.log(`💬 Mensagem enviada no chat ${chatId} por ${socket.usuario.nome}`);
                
                // Notifica se destinatário estiver offline
                await notificarSeOffline(chat, socket.userId, texto);
                
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                socket.emit('erro', { mensagem: 'Erro ao enviar mensagem' });
            }
        });
        
        // Digitando...
        socket.on('digitando', (chatId) => {
            socket.to(chatId).emit('usuario-digitando', {
                userId: socket.userId,
                nome: socket.usuario.nome,
                chatId
            });
        });
        
        // Parou de digitar
        socket.on('parou-digitar', (chatId) => {
            socket.to(chatId).emit('usuario-parou-digitar', {
                userId: socket.userId,
                chatId
            });
        });
        
        // Marcar mensagens como lidas
        socket.on('marcar-lidas', async (data) => {
            try {
                const { chatId, mensagensIds } = data;
                
                await Message.updateMany(
                    {
                        _id: { $in: mensagensIds },
                        chatId,
                        userId: { $ne: socket.userId }
                    },
                    {
                        lida: true,
                        lidaEm: new Date()
                    }
                );
                
                socket.to(chatId).emit('mensagens-lidas', {
                    chatId,
                    mensagensIds,
                    lidoPor: socket.userId
                });
                
            } catch (error) {
                console.error('Erro ao marcar mensagens:', error);
            }
        });
        
        // Desconexão
        socket.on('disconnect', () => {
            console.log(`❌ Cliente desconectado: ${socket.userId} (${socket.usuario.nome})`);
            
            // Remove da lista de online
            usuariosOnline.delete(socket.userId);
            
            // Notifica todos
            io.emit('usuario-offline', {
                userId: socket.userId,
                nome: socket.usuario.nome
            });
        });
        
        // Erro
        socket.on('error', (error) => {
            console.error('Erro no socket:', error);
        });
    });
    
    console.log('🔌 WebSocket configurado com sucesso');
};

/**
 * Notifica usuário se estiver offline
 */
const notificarSeOffline = async (chat, remetenteId, texto) => {
    try {
        // Determina destinatário
        const destinatarioId = remetenteId === chat.clienteId.toString()
            ? chat.gerenteId.toString()
            : chat.clienteId.toString();
        
        // Verifica se está offline
        if (!usuariosOnline.has(destinatarioId)) {
            const destinatario = await User.findById(destinatarioId);
            
            if (destinatario && destinatario.email) {
                // Aqui você pode implementar envio de email, push notification, etc.
                console.log(`📧 Notificação enviada para ${destinatario.email}: Nova mensagem`);
                
                // TODO: Implementar serviço de notificação
                // await enviarEmail(destinatario.email, 'Nova mensagem', texto);
            }
        }
    } catch (error) {
        console.error('Erro ao notificar offline:', error);
    }
};

/**
 * Obter usuários online
 */
const obterUsuariosOnline = () => {
    return Array.from(usuariosOnline.entries()).map(([userId, dados]) => ({
        userId,
        ...dados
    }));
};

/**
 * Verificar se usuário está online
 */
const usuarioEstaOnline = (userId) => {
    return usuariosOnline.has(userId);
};

module.exports = {
    configurarWebSocket,
    obterUsuariosOnline,
    usuarioEstaOnline
};