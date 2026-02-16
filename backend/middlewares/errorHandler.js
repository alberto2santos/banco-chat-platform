exports.errorHandler = (err, req, res, next) => {
    console.error('Erro:', err);
    
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            erro: 'Erro de validação',
            mensagens: errors
        });
    }
    
    // Erro de duplicação (unique)
    if (err.code === 11000) {
        const campo = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            erro: 'Registro duplicado',
            mensagem: `${campo} já está em uso`
        });
    }
    
    // Erro de cast (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            erro: 'ID inválido',
            mensagem: `${err.path} não é um ID válido`
        });
    }
    
    // Erro padrão
    res.status(err.status || 500).json({
        erro: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Middleware para rota não encontrada
exports.notFound = (req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        rota: req.originalUrl,
        metodo: req.method
    });
};