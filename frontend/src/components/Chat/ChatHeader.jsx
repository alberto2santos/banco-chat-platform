import React from 'react';
import { Box, IconButton, Typography, Avatar, Chip } from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    MoreVert as MoreVertIcon,
    Circle as CircleIcon
} from '@mui/icons-material';

const ChatHeader = ({ chat, outroUsuario, onVoltar }) => {
    const nomeOutroUsuario = outroUsuario?.nome || 'Usuário';
    const primeiraLetra = nomeOutroUsuario.charAt(0).toUpperCase();
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'aberto':
                return 'success';
            case 'em_atendimento':
                return 'info';
            case 'fechado':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'aberto':
                return 'Aberto';
            case 'em_atendimento':
                return 'Em Atendimento';
            case 'fechado':
                return 'Fechado';
            default:
                return status;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}
        >
            {/* Botão Voltar */}
            <IconButton
                onClick={onVoltar}
                sx={{
                    mr: 1,
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <ArrowBackIcon />
            </IconButton>

            {/* Avatar com Status Online */}
            <Box sx={{ position: 'relative', mr: 2 }}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {primeiraLetra}
                </Avatar>
                
                {/* Indicador Online */}
                <CircleIcon
                    sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        color: 'success.main',
                        bgcolor: 'white',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }}
                />
            </Box>

            {/* Informações do Usuário */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {nomeOutroUsuario}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'success.main',
                            fontSize: '0.75rem',
                            fontWeight: 500
                        }}
                    >
                        ● Online
                    </Typography>
                    
                    {chat?.status && (
                        <Chip
                            label={getStatusLabel(chat.status)}
                            size="small"
                            color={getStatusColor(chat.status)}
                            sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 600
                            }}
                        />
                    )}
                </Box>
            </Box>

            {/* Botão Mais Opções */}
            <IconButton
                sx={{
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <MoreVertIcon />
            </IconButton>
        </Box>
    );
};

export default ChatHeader;