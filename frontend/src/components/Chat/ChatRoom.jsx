import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { chatsAPI } from '../../services/api';
import socketService from '../../services/socket';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [chat, setChat] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioDigitando, setUsuarioDigitando] = useState(null);
    const messagesEndRef = useRef(null);
    const [conectado, setConectado] = useState(false);

    useEffect(() => {
        carregarChat();
        carregarMensagens();
        
        // Entra no chat via WebSocket
        console.log('🔌 Entrando no chat:', chatId);
        socketService.entrarChat(chatId);
        setConectado(true);

        // Listeners WebSocket
        const handleNovaMensagem = (data) => {
            console.log('📩 Nova mensagem recebida:', data);
            
            if (data.mensagem.chatId === chatId) {
                setMensagens(prev => {
                    // Evita duplicatas
                    const jaExiste = prev.some(m => m._id === data.mensagem._id);
                    if (jaExiste) return prev;
                    
                    return [...prev, data.mensagem];
                });
                scrollToBottom();
            }
        };

        const handleUsuarioDigitando = (data) => {
            if (data.chatId === chatId && data.userId !== usuario?._id) {
                setUsuarioDigitando(data.nome);
                setTimeout(() => setUsuarioDigitando(null), 3000);
            }
        };

        const handleUsuarioParouDigitar = (data) => {
            if (data.chatId === chatId) {
                setUsuarioDigitando(null);
            }
        };

        // Registra listeners
        socketService.onNovaMensagem(handleNovaMensagem);
        socketService.onUsuarioDigitando(handleUsuarioDigitando);
        socketService.onUsuarioParouDigitar(handleUsuarioParouDigitar);

        return () => {
            console.log('👋 Saindo do chat:', chatId);
            socketService.sairChat(chatId);
            socketService.off('nova-mensagem');
            socketService.off('usuario-digitando');
            socketService.off('usuario-parou-digitar');
            setConectado(false);
        };
    }, [chatId, usuario]);

    const carregarChat = async () => {
        try {
            const { data } = await chatsAPI.obter(chatId);
            setChat(data.chat);
        } catch (error) {
            console.error('Erro ao carregar chat:', error);
        }
    };

    const carregarMensagens = async () => {
        setLoading(true);
        try {
            const { data } = await chatsAPI.obterMensagens(chatId, { limit: 100 });
            setMensagens(data.mensagens || []);
            scrollToBottom();
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnviarMensagem = (texto) => {
        console.log('📤 Enviando mensagem:', texto);
        socketService.enviarMensagem(chatId, texto);
    };

    const handleDigitando = () => {
        socketService.digitando(chatId);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const getOutroUsuario = () => {
        if (!chat) return null;
        return usuario?.tipo === 'cliente' ? chat.gerenteId : chat.clienteId;
    };

    const outroUsuario = getOutroUsuario();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header */}
            <ChatHeader
                chat={chat}
                outroUsuario={outroUsuario}
                onVoltar={() => navigate('/chats')}
            />

            {/* Status de Conexão (DEBUG) */}
            {!conectado && (
                <Box sx={{ bgcolor: 'error.main', color: 'white', p: 1, textAlign: 'center' }}>
                    ⚠️ WebSocket desconectado
                </Box>
            )}

            {/* Mensagens */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    bgcolor: '#f5f5f5'
                }}
            >
                <MessageList mensagens={mensagens} usuarioAtual={usuario} />
                
                {usuarioDigitando && (
                    <Box sx={{ ml: 2, mb: 1 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: 'white',
                                borderRadius: 3,
                                px: 2,
                                py: 1,
                                gap: 0.5
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'grey.500',
                                    animation: 'pulse 1.4s infinite',
                                    animationDelay: '0s',
                                    '@keyframes pulse': {
                                        '0%, 60%, 100%': { opacity: 0.3 },
                                        '30%': { opacity: 1 }
                                    }
                                }}
                            />
                            <Box
                                component="span"
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'grey.500',
                                    animation: 'pulse 1.4s infinite',
                                    animationDelay: '0.2s'
                                }}
                            />
                            <Box
                                component="span"
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'grey.500',
                                    animation: 'pulse 1.4s infinite',
                                    animationDelay: '0.4s'
                                }}
                            />
                        </Box>
                    </Box>
                )}
                
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <MessageInput
                onEnviar={handleEnviarMensagem}
                onDigitando={handleDigitando}
                desabilitado={chat?.status === 'fechado'}
            />
        </Box>
    );
};

export default ChatRoom;