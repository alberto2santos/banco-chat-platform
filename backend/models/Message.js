const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    texto: {
        type: String,
        required: [true, 'Mensagem não pode estar vazia'],
        trim: true,
        maxlength: [1000, 'Mensagem muito longa (máximo 1000 caracteres)']
    },
    tipo: {
        type: String,
        enum: ['texto', 'imagem', 'arquivo', 'sistema'],
        default: 'texto'
    },
    lida: {
        type: Boolean,
        default: false
    },
    lidaEm: {
        type: Date,
        default: null
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'criadoEm', updatedAt: false }
});

// Índices
messageSchema.index({ chatId: 1, criadoEm: -1 });
messageSchema.index({ userId: 1 });

// TTL - Remove mensagens antigas após 90 dias
messageSchema.index({ criadoEm: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Message', messageSchema);