const { validationResult } = require('express-validator');

// Middleware para processar validações
exports.validar = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            erro: 'Dados inválidos',
            erros: errors.array().map(err => ({
                campo: err.path,
                mensagem: err.msg
            }))
        });
    }
    
    next();
};