const mongoose = require('mongoose');
const dns = require('dns');

// Configura DNS alternativo (Google DNS)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        console.log('🔍 Tentando conectar ao MongoDB...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 75000,
            family: 4
        });

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        console.log(`📊 Banco de dados: ${conn.connection.name}`);
        
    } catch (error) {
        console.error('❌ ERRO AO CONECTAR MONGODB');
        console.error('Mensagem:', error.message);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose conectado');
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Mongoose desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Erro no Mongoose:', err.message);
});

module.exports = connectDB;