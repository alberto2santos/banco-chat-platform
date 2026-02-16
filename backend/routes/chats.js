const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { validar } = require('../middlewares/validate');
const { verificaLogin, verificaGerente } = require('../middlewares/auth');
const { limiterCriarChat } = require('../middlewares/rateLimiter');
const {
    criarChat,
    listarChats,
    obterChat,
    obterMensagens,
    atualizarStatus
} = require('../controllers/chatController');

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Gerenciamento de chats entre clientes e gerentes
 */

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Criar novo chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gerenteId
 *               - assunto
 *             properties:
 *               gerenteId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               assunto:
 *                 type: string
 *                 enum: [transacoes, investimentos, operacoes, duvidas, outros]
 *                 example: investimentos
 *               prioridade:
 *                 type: string
 *                 enum: [baixa, media, alta]
 *                 example: media
 *     responses:
 *       201:
 *         description: Chat criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/',
    verificaLogin,
    limiterCriarChat,
    [
        body('gerenteId')
            .isMongoId()
            .withMessage('ID de gerente inválido'),
        body('assunto')
            .isIn(['transacoes', 'investimentos', 'operacoes', 'duvidas', 'outros'])
            .withMessage('Assunto inválido'),
        body('prioridade')
            .optional()
            .isIn(['baixa', 'media', 'alta'])
            .withMessage('Prioridade inválida')
    ],
    validar,
    criarChat
);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Listar chats do usuário
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, em_atendimento, fechado]
 *         description: Filtrar por status
 *       - in: query
 *         name: assunto
 *         schema:
 *           type: string
 *         description: Filtrar por assunto
 *     responses:
 *       200:
 *         description: Lista de chats
 */
router.get('/',
    verificaLogin,
    [
        query('status')
            .optional()
            .isIn(['aberto', 'em_atendimento', 'fechado'])
            .withMessage('Status inválido'),
        query('assunto')
            .optional()
            .isIn(['transacoes', 'investimentos', 'operacoes', 'duvidas', 'outros'])
            .withMessage('Assunto inválido')
    ],
    validar,
    listarChats
);

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Obter detalhes de um chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do chat
 *     responses:
 *       200:
 *         description: Detalhes do chat
 *       404:
 *         description: Chat não encontrado
 */
router.get('/:id',
    verificaLogin,
    [
        param('id')
            .isMongoId()
            .withMessage('ID inválido')
    ],
    validar,
    obterChat
);

/**
 * @swagger
 * /api/chats/{id}/mensagens:
 *   get:
 *     summary: Obter mensagens de um chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de mensagens
 */
router.get('/:id/mensagens',
    verificaLogin,
    [
        param('id')
            .isMongoId()
            .withMessage('ID inválido'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit deve ser entre 1 e 100'),
        query('skip')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Skip deve ser maior ou igual a 0')
    ],
    validar,
    obterMensagens
);

/**
 * @swagger
 * /api/chats/{id}/status:
 *   put:
 *     summary: Atualizar status do chat (Gerente/Admin)
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [aberto, em_atendimento, fechado]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.put('/:id/status',
    verificaLogin,
    verificaGerente,
    [
        param('id')
            .isMongoId()
            .withMessage('ID inválido'),
        body('status')
            .isIn(['aberto', 'em_atendimento', 'fechado'])
            .withMessage('Status inválido')
    ],
    validar,
    atualizarStatus
);

module.exports = router;