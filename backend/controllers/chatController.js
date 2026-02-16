const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc    Criar novo chat
 * @route   POST /api/chats
 * @access  Private
 */
exports.criarChat = async (req, res) => {
    try {
        const { gerenteId, assunto, prioridade } = req.body;
        
        // Verifica se gerente existe
        const gerente = await User.findById(gerenteId);
        if (!gerente || gerente.tipo !== 'gerente') {
            return res.status(400).json({
                erro: 'Gerente inválido'
            });
        }
        
        // Cria chat
        const chat = await Chat.create({
            clienteId: req.usuario._id,
            gerenteId,
            assunto,
            prioridade: prioridade || 'media',
            status: 'aberto'
        });
        
        // Popula dados
        await chat.populate('clienteId', 'nome email');
        await chat.populate('gerenteId', 'nome email');
        
        res.status(201).json({
            mensagem: 'Chat criado com sucesso!',
            chat
        });
        
    } catch (error) {
        console.error('Erro ao criar chat:', error);
        res.status(500).json({
            erro: 'Erro ao criar chat',
            mensagem: error.message
        });
    }
};

/**
 * @desc    Listar chats do usuário
 * @route   GET /api/chats
 * @access  Private
 */
exports.listarChats = async (req, res) => {
    try {
        const { status, assunto } = req.query;
        
        // Filtro baseado no tipo de usuário
        let filtro = {};
        if (req.usuario.tipo === 'cliente') {
            filtro.clienteId = req.usuario._id;
        } else if (req.usuario.tipo === 'gerente') {
            filtro.gerenteId = req.usuario._id;
        }
        
        // Filtros adicionais
        if (status) filtro.status = status;
        if (assunto) filtro.assunto = assunto;
        
        const chats = await Chat.find(filtro)
            .populate('clienteId', 'nome email')
            .populate('gerenteId', 'nome email')
            .sort({ atualizadoEm: -1 });
        
        res.json({
            total: chats.length,
            chats
        });
        
    } catch (error) {
        console.error('Erro ao listar chats:', error);
        res.status(500).json({
            erro: 'Erro ao listar chats'
        });
    }
};

/**
 * @desc    Obter detalhes de um chat
 * @route   GET /api/chats/:id
 * @access  Private
 */
exports.obterChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('clienteId', 'nome email telefone')
            .populate('gerenteId', 'nome email telefone');
        
        if (!chat) {
            return res.status(404).json({
                erro: 'Chat não encontrado'
            });
        }
        
        // Verifica permissão
        const usuarioId = req.usuario._id.toString();
        const clienteId = chat.clienteId._id.toString();
        const gerenteId = chat.gerenteId._id.toString();
        
        if (usuarioId !== clienteId && usuarioId !== gerenteId && req.usuario.tipo !== 'admin') {
            return res.status(403).json({
                erro: 'Acesso negado'
            });
        }
        
        res.json({ chat });
        
    } catch (error) {
        console.error('Erro ao buscar chat:', error);
        res.status(500).json({
            erro: 'Erro ao buscar chat'
        });
    }
};

/**
 * @desc    Obter mensagens de um chat
 * @route   GET /api/chats/:id/mensagens
 * @access  Private
 */
exports.obterMensagens = async (req, res) => {
    try {
        const { limit = 50, skip = 0 } = req.query;
        
        // Verifica se chat existe e usuário tem permissão
        const chat = await Chat.findById(req.params.id);
        
        if (!chat) {
            return res.status(404).json({
                erro: 'Chat não encontrado'
            });
        }
        
        const usuarioId = req.usuario._id.toString();
        const clienteId = chat.clienteId.toString();
        const gerenteId = chat.gerenteId.toString();
        
        if (usuarioId !== clienteId && usuarioId !== gerenteId && req.usuario.tipo !== 'admin') {
            return res.status(403).json({
                erro: 'Acesso negado'
            });
        }
        
        // Busca mensagens
        const mensagens = await Message.find({ chatId: req.params.id })
            .populate('userId', 'nome avatar')
            .sort({ criadoEm: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
        
        const total = await Message.countDocuments({ chatId: req.params.id });
        
        res.json({
            total,
            mensagens: mensagens.reverse()
        });
        
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({
            erro: 'Erro ao buscar mensagens'
        });
    }
};

/**
 * @desc    Atualizar status do chat
 * @route   PUT /api/chats/:id/status
 * @access  Private (Gerente/Admin)
 */
exports.atualizarStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const chat = await Chat.findById(req.params.id);
        
        if (!chat) {
            return res.status(404).json({
                erro: 'Chat não encontrado'
            });
        }
        
        // Atualiza status
        chat.status = status;
        if (status === 'fechado') {
            chat.encerradoEm = new Date();
        }
        
        await chat.save();
        
        res.json({
            mensagem: 'Status atualizado com sucesso!',
            chat
        });
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            erro: 'Erro ao atualizar status'
        });
    }
};