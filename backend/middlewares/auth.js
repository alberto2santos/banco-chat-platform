const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifica se usuário está autenticado
exports.verificaLogin = async (req, res, next) => {
    try {
        let token;
        
        // Busca token no header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({
                erro: 'Acesso negado',
                mensagem: 'Token não fornecido'
            });
        }
        
        // Verifica token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Busca usuário
        const usuario = await User.findById(decoded.id);
        
        if (!usuario || !usuario.ativo) {
            return res.status(401).json({
                erro: 'Usuário não encontrado ou inativo'
            });
        }
        
        // Adiciona usuário na requisição
        req.usuario = usuario;
        next();
        
    } catch (error) {
        console.error('Erro na autenticação:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ erro: 'Token inválido' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ erro: 'Token expirado' });
        }
        
        res.status(500).json({ erro: 'Erro ao autenticar' });
    }
};

// Verifica se usuário é gerente
exports.verificaGerente = (req, res, next) => {
    if (req.usuario.tipo !== 'gerente' && req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            erro: 'Acesso negado',
            mensagem: 'Apenas gerentes podem acessar'
        });
    }
    next();
};

// Verifica se usuário é admin
exports.verificaAdmin = (req, res, next) => {
    if (req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            erro: 'Acesso negado',
            mensagem: 'Apenas administradores podem acessar'
        });
    }
    next();
};

// Carrega dados do usuário na sessão
exports.carregaUsuario = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const usuario = await User.findById(req.session.userId);
            if (usuario) {
                req.usuario = usuario;
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }
    next();
};