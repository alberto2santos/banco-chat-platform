import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carrega usuário do localStorage
        const usuarioSalvo = localStorage.getItem('usuario');
        if (usuarioSalvo) {
            try {
                setUsuario(JSON.parse(usuarioSalvo));
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                localStorage.removeItem('usuario');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Conecta socket quando tem token
        if (token && !socketService.connected) {
            socketService.connect(token);
        }
    }, [token]);

    const login = async (email, senha) => {
        try {
            const { data } = await authAPI.login({ email, senha });
            
            setUsuario(data.usuario);
            setToken(data.token);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Conecta socket
            socketService.connect(data.token);
            
            return { sucesso: true };
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                sucesso: false,
                erro: error.response?.data?.mensagem || 'Erro ao fazer login'
            };
        }
    };

    const registro = async (dados) => {
        try {
            const { data } = await authAPI.registro(dados);
            
            setUsuario(data.usuario);
            setToken(data.token);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Conecta socket
            socketService.connect(data.token);
            
            return { sucesso: true };
        } catch (error) {
            console.error('Erro no registro:', error);
            return {
                sucesso: false,
                erro: error.response?.data?.mensagem || 'Erro ao criar conta'
            };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            setUsuario(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            socketService.disconnect();
        }
    };

    const value = {
        usuario,
        token,
        loading,
        estaAutenticado: !!token,
        login,
        registro,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};