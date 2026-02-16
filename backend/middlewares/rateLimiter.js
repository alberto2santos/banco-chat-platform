const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter Geral
 * Limita requisições gerais da API
 */
exports.limiterGeral = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // 100 requisições
    message: {
        erro: 'Muitas requisições',
        mensagem: 'Você excedeu o limite de requisições. Tente novamente mais tarde.',
        tentarNovamenteEm: 'minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            erro: 'Muitas requisições',
            mensagem: 'Você atingiu o limite de requisições. Aguarde alguns minutos e tente novamente.',
            tentarNovamenteEm: Math.ceil(req.rateLimit.resetTime / 60000) + ' minutos'
        });
    }
});

/**
 * Rate Limiter para Login
 */
exports.limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        erro: 'Muitas tentativas de login',
        mensagem: 'Você excedeu o limite de tentativas de login. Aguarde 15 minutos.'
    },
    handler: (req, res) => {
        console.warn(`⚠️  Limite de login excedido: ${req.ip}`);
        res.status(429).json({
            erro: 'Conta temporariamente bloqueada',
            mensagem: 'Muitas tentativas de login falhadas. Por segurança, sua conta foi temporariamente bloqueada.',
            tentarNovamenteEm: '15 minutos',
            suporte: 'Entre em contato com o suporte se precisar de ajuda'
        });
    }
});

/**
 * Rate Limiter para Registro
 */
exports.limiterRegistro = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    skipSuccessfulRequests: false,
    message: {
        erro: 'Limite de registros excedido',
        mensagem: 'Você atingiu o limite de criação de contas. Tente novamente mais tarde.'
    },
    handler: (req, res) => {
        console.warn(`⚠️  Limite de registro excedido: ${req.ip}`);
        res.status(429).json({
            erro: 'Limite de registros excedido',
            mensagem: 'Você atingiu o limite de criação de contas por hora.',
            tentarNovamenteEm: '1 hora'
        });
    }
});

/**
 * Rate Limiter para Mensagens
 */
exports.limiterMensagens = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    skipFailedRequests: true,
    message: {
        erro: 'Muitas mensagens',
        mensagem: 'Você está enviando mensagens muito rápido. Aguarde um momento.'
    },
    handler: (req, res) => {
        res.status(429).json({
            erro: 'Limite de mensagens excedido',
            mensagem: 'Por favor, aguarde alguns segundos antes de enviar outra mensagem.',
            tentarNovamenteEm: '1 minuto'
        });
    }
});

/**
 * Rate Limiter para Criação de Chats
 */
exports.limiterCriarChat = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    skipFailedRequests: true,
    message: {
        erro: 'Limite de chats excedido',
        mensagem: 'Você atingiu o limite de criação de chats por hora.'
    },
    handler: (req, res) => {
        res.status(429).json({
            erro: 'Limite de chats excedido',
            mensagem: 'Você criou muitos chats recentemente. Aguarde antes de criar um novo.',
            tentarNovamenteEm: '1 hora'
        });
    }
});

/**
 * Rate Limiter para API de Documentação
 */
exports.limiterDocs = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate Limiter Customizado por IP
 */
exports.limiterPorIP = (maxRequisicoes = 100, janela = 15) => {
    return rateLimit({
        windowMs: janela * 60 * 1000,
        max: maxRequisicoes,
        keyGenerator: (req) => {
            return req.ip || 
                   req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress;
        },
        handler: (req, res) => {
            res.status(429).json({
                erro: 'Limite de requisições excedido',
                ip: req.ip,
                tentarNovamenteEm: Math.ceil(req.rateLimit.resetTime / 60000) + ' minutos'
            });
        }
    });
};

/**
 * Rate Limiter por Usuário Autenticado
 */
exports.limiterPorUsuario = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    keyGenerator: (req) => {
        if (req.usuario && req.usuario._id) {
            return req.usuario._id.toString();
        }
        return req.ip;
    },
    skip: (req) => {
        return req.usuario && req.usuario.tipo === 'admin';
    },
    handler: (req, res) => {
        res.status(429).json({
            erro: 'Limite de requisições excedido',
            mensagem: 'Você atingiu o limite de requisições permitidas.',
            tentarNovamenteEm: Math.ceil(req.rateLimit.resetTime / 60000) + ' minutos'
        });
    }
});

/**
 * Middleware para logar requisições bloqueadas
 */
exports.logBloqueio = (req, res, next) => {
    const originalHandler = res.status;
    
    res.status = function(code) {
        if (code === 429) {
            console.warn('⚠️  RATE LIMIT BLOQUEIO:', {
                ip: req.ip,
                rota: req.originalUrl,
                metodo: req.method,
                usuario: req.usuario ? req.usuario.email : 'Não autenticado',
                timestamp: new Date().toISOString()
            });
        }
        return originalHandler.apply(this, arguments);
    };
    
    next();
};

/**
 * Configuração para ambientes de desenvolvimento
 */
exports.limiterDev = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️  Rate limiting desabilitado (ambiente de desenvolvimento)');
        return next();
    }
    
    return exports.limiterGeral(req, res, next);
};