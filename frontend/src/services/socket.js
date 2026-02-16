import { io } from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3000';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    // Conecta ao WebSocket
    connect(token) {
        if (this.socket?.connected) {
            console.log('Socket já conectado');
            return;
        }

        this.socket = io(WS_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
            console.log('✅ WebSocket conectado:', this.socket.id);
            this.connected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket desconectado:', reason);
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Erro de conexão:', error.message);
        });

        return this.socket;
    }

    // Desconecta
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    // Entra em um chat
    entrarChat(chatId) {
        if (this.socket?.connected) {
            this.socket.emit('entrar-chat', chatId);
        }
    }

    // Sai de um chat
    sairChat(chatId) {
        if (this.socket?.connected) {
            this.socket.emit('sair-chat', chatId);
        }
    }

    // Envia mensagem
    enviarMensagem(chatId, texto) {
        if (this.socket?.connected) {
            this.socket.emit('enviar-mensagem', { chatId, texto });
        }
    }

    // Digitando
    digitando(chatId) {
        if (this.socket?.connected) {
            this.socket.emit('digitando', chatId);
        }
    }

    // Parou de digitar
    parouDigitar(chatId) {
        if (this.socket?.connected) {
            this.socket.emit('parou-digitar', chatId);
        }
    }

    // Marca mensagens como lidas
    marcarLidas(chatId, mensagensIds) {
        if (this.socket?.connected) {
            this.socket.emit('marcar-lidas', { chatId, mensagensIds });
        }
    }

    // Listeners
    onNovaMensagem(callback) {
        if (this.socket) {
            this.socket.on('nova-mensagem', callback);
        }
    }

    onUsuarioDigitando(callback) {
        if (this.socket) {
            this.socket.on('usuario-digitando', callback);
        }
    }

    onUsuarioParouDigitar(callback) {
        if (this.socket) {
            this.socket.on('usuario-parou-digitar', callback);
        }
    }

    onUsuarioOnline(callback) {
        if (this.socket) {
            this.socket.on('usuario-online', callback);
        }
    }

    onUsuarioOffline(callback) {
        if (this.socket) {
            this.socket.on('usuario-offline', callback);
        }
    }

    onErro(callback) {
        if (this.socket) {
            this.socket.on('erro', callback);
        }
    }

    // Remove listeners
    off(evento) {
        if (this.socket) {
            this.socket.off(evento);
        }
    }
}

// Exporta instância única (Singleton)
const socketService = new SocketService();
export default socketService;