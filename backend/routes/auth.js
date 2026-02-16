const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validar } = require('../middlewares/validate');
const { verificaLogin } = require('../middlewares/auth');
const { limiterLogin, limiterRegistro } = require('../middlewares/rateLimiter');
const {
    registro,
    login,
    logout,
    me
} = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *               tipo:
 *                 type: string
 *                 enum: [cliente, gerente]
 *                 example: cliente
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 */
router.post('/registro',
    limiterRegistro,
    [
        body('nome')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Nome deve ter no mínimo 3 caracteres'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email inválido'),
        body('senha')
            .isLength({ min: 6 })
            .withMessage('Senha deve ter no mínimo 6 caracteres'),
        body('tipo')
            .optional()
            .isIn(['cliente', 'gerente'])
            .withMessage('Tipo inválido')
    ],
    validar,
    registro
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login',
    limiterLogin,
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email inválido'),
        body('senha')
            .notEmpty()
            .withMessage('Senha é obrigatória')
    ],
    validar,
    login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout de usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post('/logout', verificaLogin, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário logado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autenticado
 */
router.get('/me', verificaLogin, me);

module.exports = router;