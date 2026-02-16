const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gerenteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assunto: {
        type: String,
        enum: ['transacoes', 'investimentos', 'operacoes', 'duvidas', 'outros'],
        required: true
    },
    status: {
        type: String,
        enum: ['aberto', 'em_atendimento', 'fechado'],
        default: 'aberto'
    },
    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta'],
        default: 'media'
    },
    criadoEm: {
        type: Date,
        default: Date.now
    },
    atualizadoEm: {
        type: Date,
        default: Date.now
    },
    encerradoEm: {
        type: Date,
        default: null
    }
}, {
    timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' }
});

// Índices para otimizar consultas
chatSchema.index({ clienteId: 1, status: 1 });
chatSchema.index({ gerenteId: 1, status: 1 });
chatSchema.index({ criadoEm: -1 });

module.exports = mongoose.model('Chat', chatSchema);