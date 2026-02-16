import { createContext, useState, useEffect, useCallback } from 'react';
import { chatsAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../hooks/useAuth';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { estaAutenticado } = useAuth();
    const [chats, setChats] = useState([]);
    const [chatAtual, setChatAtual] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usuariosOnline, setUsuariosOnline] = useState(new Set());
    const [usuarioDigitando, setUsuarioDigitando] = useState(null);

    // Carrega lista de chats
    const carregarChats = useCallback(async (filtros = {}) => {
        if (!estaAutenticado) return;
        
        setLoading(true);
        try {
            const { data } = await chatsAPI.listar(filtros);
            setChats(data.chats || []);
        } catch (error) {
            console.error('Erro ao carregar chats:', error);
        } finally {
            setLoading(false);
        }
    }, [estaAutenticado]);

    // Carrega mensagens de um chat
    const carregarMensagens = useCallback(async (chatId) => {
        setLoading(true);
        try {
            const { data } = await chatsAPI.obterMensagens(chatId, { limit: 100 });
            setMensagens(data.mensagens || []);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cria novo chat
    const criarChat = async (dados) => {
        try {
            const { data } = await chatsAPI.criar(dados);
            setChats(prev => [data.chat, ...prev]);
            return { sucesso: true, chat: data.chat };
        } catch (error) {
            console.error('Erro ao criar chat:', error);
            return {
                sucesso: false,
                erro: error.response?.data?.mensagem || 'Erro ao criar chat'
            };
        }
    };

    // Seleciona chat
    const selecionarChat = useCallback(async (chat) => {
        if (chatAtual && chatAtual._id !== chat._id) {
            socketService.sairChat(chatAtual._id);
        }
        
        setChatAtual(chat);
        await carregarMensagens(chat._id);
        socketService.entrarChat(chat._id);
    }, [chatAtual, carregarMensagens]);

    // Envia mensagem
    const enviarMensagem = (texto) => {
        if (chatAtual && texto.trim()) {
            socketService.enviarMensagem(chatAtual._id, texto.trim());
        }
    };

    // WebSocket listeners
    useEffect(() => {
        if (!estaAutenticado) return;

        // Nova mensagem
        socketService.onNovaMensagem((data) => {
            setMensagens(prev => [...prev, data.mensagem]);
            
            // Atualiza último timestamp do chat
            setChats(prev => prev.map(c =>
                c._id === data.mensagem.chatId
                    ? { ...c, atualizadoEm: data.mensagem.criadoEm }
                    : c
            ));
        });

        // Usuário digitando
        socketService.onUsuarioDigitando((data) => {
            if (chatAtual?._id === data.chatId) {
                setUsuarioDigitando(data.nome);
                setTimeout(() => setUsuarioDigitando(null), 3000);
            }
        });

        // Usuário parou de digitar
        socketService.onUsuarioParouDigitar(() => {
            setUsuarioDigitando(null);
        });

        // Usuário online
        socketService.onUsuarioOnline((data) => {
            setUsuariosOnline(prev => new Set([...prev, data.userId]));
        });

        // Usuário offline
        socketService.onUsuarioOffline((data) => {
            setUsuariosOnline(prev => {
                const novo = new Set(prev);
                novo.delete(data.userId);
                return novo;
            });
        });

        // Erro
        socketService.onErro((data) => {
            console.error('Erro WebSocket:', data.mensagem);
        });

        return () => {
            socketService.off('nova-mensagem');
            socketService.off('usuario-digitando');
            socketService.off('usuario-parou-digitar');
            socketService.off('usuario-online');
            socketService.off('usuario-offline');
            socketService.off('erro');
        };
    }, [estaAutenticado, chatAtual]);

    const value = {
        chats,
        chatAtual,
        mensagens,
        loading,
        usuariosOnline,
        usuarioDigitando,
        carregarChats,
        carregarMensagens,
        criarChat,
        selecionarChat,
        enviarMensagem
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};