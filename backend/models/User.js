const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [3, 'Nome deve ter no mínimo 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
        select: false
    },
    tipo: {
        type: String,
        enum: ['cliente', 'gerente', 'admin'],
        default: 'cliente'
    },
    ativo: {
        type: Boolean,
        default: true
    },
    telefone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    criadoEm: {
        type: Date,
        default: Date.now
    },
    atualizadoEm: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' }
});

// Criptografa senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar senha
userSchema.methods.compararSenha = async function(senhaInformada) {
    return await bcrypt.compare(senhaInformada, this.senha);
};

// Remove senha do retorno JSON
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.senha;
    return obj;
};

module.exports = mongoose.model('User', userSchema);