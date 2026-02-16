const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gera token JWT
const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

/**
 * @desc    Registrar novo usuário
 * @route   POST /api/auth/registro
 * @access  Public
 */
exports.registro = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;
        
        // Verifica se email já existe
        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({
                erro: 'Email já cadastrado'
            });
        }
        
        // Cria usuário
        const usuario = await User.create({
            nome,
            email,
            senha,
            tipo: tipo || 'cliente'
        });
        
        // Gera token
        const token = gerarToken(usuario._id);
        
        res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            },
            token
        });
        
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            erro: 'Erro ao criar usuário',
            mensagem: error.message
        });
    }
};

/**
 * @desc    Login de usuário
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Busca usuário com senha
        const usuario = await User.findOne({ email }).select('+senha');
        
        if (!usuario) {
            return res.status(401).json({
                erro: 'Credenciais inválidas',
                mensagem: 'Email ou senha incorretos'
            });
        }
        
        // Verifica senha
        const senhaCorreta = await usuario.compararSenha(senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'Credenciais inválidas',
                mensagem: 'Email ou senha incorretos'
            });
        }
        
        // Verifica se usuário está ativo
        if (!usuario.ativo) {
            return res.status(403).json({
                erro: 'Conta inativa',
                mensagem: 'Entre em contato com o suporte'
            });
        }
        
        // Gera token
        const token = gerarToken(usuario._id);
        
        // Salva na sessão
        req.session.userId = usuario._id;
        
        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            },
            token
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            erro: 'Erro ao fazer login',
            mensagem: error.message
        });
    }
};

/**
 * @desc    Logout de usuário
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao fazer logout'
                });
            }
            
            res.json({
                mensagem: 'Logout realizado com sucesso!'
            });
        });
        
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({
            erro: 'Erro ao fazer logout'
        });
    }
};

/**
 * @desc    Obter dados do usuário logado
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.me = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario._id);
        
        res.json({
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                telefone: usuario.telefone,
                avatar: usuario.avatar,
                criadoEm: usuario.criadoEm
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            erro: 'Erro ao buscar dados do usuário'
        });
    }
};