import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Cria instância do axios
const api = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Interceptor de requisição (adiciona token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de resposta (trata erros)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        
        if (error.response?.status === 429) {
            // Rate limit excedido
            console.warn('Rate limit excedido. Aguarde antes de tentar novamente.');
        }
        
        return Promise.reject(error);
    }
);

// ========================================
// AUTH
// ========================================

export const authAPI = {
    registro: (dados) => api.post('/auth/registro', dados),
    login: (dados) => api.post('/auth/login', dados),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me')
};

// ========================================
// CHATS
// ========================================

export const chatsAPI = {
    listar: (params) => api.get('/chats', { params }),
    criar: (dados) => api.post('/chats', dados),
    obter: (id) => api.get(`/chats/${id}`),
    obterMensagens: (id, params) => api.get(`/chats/${id}/mensagens`, { params }),
    atualizarStatus: (id, status) => api.put(`/chats/${id}/status`, { status })
};

// ========================================
// GERENTES
// ========================================

export const gerentesAPI = {
    listar: () => api.get('/gerentes'),
    disponibilidade: (id) => api.get(`/gerentes/${id}/disponibilidade`)
};

export default api;