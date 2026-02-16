// Serviço de notificações (Email, SMS, Push)

/**
 * Envia email
 * TODO: Implementar com provedor real (SendGrid, AWS SES, etc.)
 */
const enviarEmail = async (para, assunto, corpo) => {
    try {
        console.log('📧 Enviando email...');
        console.log(`Para: ${para}`);
        console.log(`Assunto: ${assunto}`);
        console.log(`Corpo: ${corpo}`);
        
        // TODO: Implementar envio real
        // const nodemailer = require('nodemailer');
        // const transporter = nodemailer.createTransport({...});
        // await transporter.sendMail({...});
        
        return { sucesso: true, mensagem: 'Email enviado' };
        
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return { sucesso: false, erro: error.message };
    }
};

/**
 * Envia SMS
 * TODO: Implementar com provedor (Twilio, AWS SNS, etc.)
 */
const enviarSMS = async (telefone, mensagem) => {
    try {
        console.log('📱 Enviando SMS...');
        console.log(`Para: ${telefone}`);
        console.log(`Mensagem: ${mensagem}`);
        
        // TODO: Implementar envio real
        
        return { sucesso: true, mensagem: 'SMS enviado' };
        
    } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        return { sucesso: false, erro: error.message };
    }
};

/**
 * Envia push notification
 * TODO: Implementar com Firebase Cloud Messaging
 */
const enviarPushNotification = async (userId, titulo, corpo, dados) => {
    try {
        console.log('🔔 Enviando push notification...');
        console.log(`UserId: ${userId}`);
        console.log(`Título: ${titulo}`);
        console.log(`Corpo: ${corpo}`);
        
        // TODO: Implementar com FCM
        
        return { sucesso: true, mensagem: 'Push enviado' };
        
    } catch (error) {
        console.error('Erro ao enviar push:', error);
        return { sucesso: false, erro: error.message };
    }
};

/**
 * Notifica novo chat
 */
const notificarNovoChat = async (gerente, cliente, assunto) => {
    const mensagem = `Novo chat de ${cliente.nome} sobre ${assunto}`;
    
    await enviarEmail(
        gerente.email,
        'Novo Chat - Banco',
        mensagem
    );
    
    if (gerente.telefone) {
        await enviarSMS(gerente.telefone, mensagem);
    }
};

/**
 * Notifica nova mensagem
 */
const notificarNovaMensagem = async (destinatario, remetente, textoMensagem) => {
    const mensagem = `Nova mensagem de ${remetente.nome}: ${textoMensagem.substring(0, 50)}`;
    
    await enviarPushNotification(
        destinatario._id,
        `Mensagem de ${remetente.nome}`,
        textoMensagem,
        { tipo: 'nova_mensagem' }
    );
};

module.exports = {
    enviarEmail,
    enviarSMS,
    enviarPushNotification,
    notificarNovoChat,
    notificarNovaMensagem
};