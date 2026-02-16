import { Box, Paper, Typography, Avatar, Zoom, Chip } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DoneAll } from '@mui/icons-material';

const MessageList = ({ mensagens, usuarioAtual }) => {
    if (!mensagens || mensagens.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: 'text.secondary',
                    gap: 2
                }}
            >
                <Box sx={{ fontSize: 80, opacity: 0.3 }}>💬</Box>
                <Typography variant="h6" color="text.secondary">
                    Nenhuma mensagem ainda
                </Typography>
                <Typography variant="body2" color="text.disabled">
                    Envie a primeira mensagem para começar a conversa
                </Typography>
            </Box>
        );
    }

    const isMinhaMsg = (mensagem) => {
        if (!mensagem?.userId?._id || !usuarioAtual?._id) {
            return false;
        }
        return mensagem.userId._id === usuarioAtual._id;
    };

    const formatarData = (data) => {
        try {
            const dataMsg = new Date(data);
            
            if (isToday(dataMsg)) {
                return format(dataMsg, 'HH:mm', { locale: ptBR });
            } else if (isYesterday(dataMsg)) {
                return `Ontem às ${format(dataMsg, 'HH:mm', { locale: ptBR })}`;
            } else {
                return format(dataMsg, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
            }
        } catch (error) {
            return 'agora';
        }
    };

    const agruparMensagensPorData = (mensagens) => {
        const grupos = {};
        
        mensagens.forEach(msg => {
            const data = new Date(msg.criadoEm);
            let chave;
            
            if (isToday(data)) {
                chave = 'Hoje';
            } else if (isYesterday(data)) {
                chave = 'Ontem';
            } else {
                chave = format(data, "dd/MM/yyyy", { locale: ptBR });
            }
            
            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(msg);
        });
        
        return grupos;
    };

    const grupos = agruparMensagensPorData(mensagens);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Object.entries(grupos).map(([data, mensagensGrupo]) => (
                <Box key={data}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Chip
                            label={data}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(0, 0, 0, 0.05)',
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                fontWeight: 500
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {mensagensGrupo.map((mensagem, index) => {
                            const minhaMsg = isMinhaMsg(mensagem);
                            const nomeRemetente = mensagem.userId?.nome || 'Usuário';
                            const primeiraLetra = nomeRemetente.charAt(0).toUpperCase();
                            
                            const msgAnterior = index > 0 ? mensagensGrupo[index - 1] : null;
                            const mudouUsuario = !msgAnterior || 
                                msgAnterior.userId?._id !== mensagem.userId?._id;

                            return (
                                <Zoom in={true} key={mensagem._id || index}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: minhaMsg ? 'row-reverse' : 'row',
                                            alignItems: 'flex-end',
                                            gap: 1,
                                            mb: mudouUsuario ? 1 : 0.25
                                        }}
                                    >
                                        {mudouUsuario ? (
                                            <Avatar
                                                sx={{
                                                    bgcolor: minhaMsg ? 'primary.main' : 'secondary.main',
                                                    width: 36,
                                                    height: 36,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }}
                                            >
                                                {primeiraLetra}
                                            </Avatar>
                                        ) : (
                                            <Box sx={{ width: 36 }} />
                                        )}

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                maxWidth: '65%',
                                                alignItems: minhaMsg ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            {!minhaMsg && mudouUsuario && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        mb: 0.5,
                                                        ml: 1.5,
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {nomeRemetente}
                                                </Typography>
                                            )}

                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: minhaMsg ? 'primary.main' : '#ffffff',
                                                    color: minhaMsg ? 'white' : 'text.primary',
                                                    borderRadius: 2.5,
                                                    borderTopRightRadius: minhaMsg && mudouUsuario ? 0.5 : 2.5,
                                                    borderTopLeftRadius: !minhaMsg && mudouUsuario ? 0.5 : 2.5,
                                                    boxShadow: minhaMsg ? 
                                                        '0 2px 12px rgba(25, 118, 210, 0.3)' : 
                                                        '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: minhaMsg ? 
                                                            '0 4px 16px rgba(25, 118, 210, 0.4)' : 
                                                            '0 4px 12px rgba(0, 0, 0, 0.12)'
                                                    }
                                                }}
                                            >
                                                <Typography 
                                                    variant="body1"
                                                    sx={{
                                                        wordBreak: 'break-word',
                                                        fontSize: '0.95rem',
                                                        lineHeight: 1.5
                                                    }}
                                                >
                                                    {mensagem.texto}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mt: 0.5,
                                                        justifyContent: 'flex-end'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            opacity: minhaMsg ? 0.8 : 0.6,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {formatarData(mensagem.criadoEm)}
                                                    </Typography>
                                                    
                                                    {minhaMsg && (
                                                        <DoneAll sx={{ fontSize: 14, opacity: 0.8 }} />
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Box>
                                </Zoom>
                            );
                        })}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;