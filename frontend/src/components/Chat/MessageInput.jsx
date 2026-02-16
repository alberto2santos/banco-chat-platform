import React, { useState, useRef } from 'react';
import { 
    Box, 
    TextField, 
    IconButton, 
    Paper, 
    Fade, 
    Tooltip, 
    Typography 
} from '@mui/material';
import {
    Send as SendIcon,
    EmojiEmotions as EmojiIcon,
    AttachFile as AttachIcon,
    Mic as MicIcon
} from '@mui/icons-material';


const MessageInput = ({ onEnviar, onDigitando, desabilitado }) => {
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        setMensagem(e.target.value);
        if (onDigitando) {
            onDigitando();
        }
    };

    const handleEnviar = async () => {
        const textoTrimado = mensagem.trim();
        
        if (textoTrimado && !desabilitado && !enviando) {
            setEnviando(true);
            
            try {
                await onEnviar(textoTrimado);
                setMensagem('');
                
                // Foca no input novamente
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            } catch (error) {
                console.error('Erro ao enviar:', error);
            } finally {
                setEnviando(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEnviar();
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'sticky',
                bottom: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-end'
                }}
            >
                {/* Botão Emoji */}
                <Tooltip title="Emojis" arrow>
                    <IconButton
                        size="large"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'primary.lighter'
                            }
                        }}
                    >
                        <EmojiIcon />
                    </IconButton>
                </Tooltip>

                {/* Botão Anexar */}
                <Tooltip title="Anexar arquivo" arrow>
                    <IconButton
                        size="large"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'primary.lighter'
                            }
                        }}
                    >
                        <AttachIcon />
                    </IconButton>
                </Tooltip>

                {/* Input de Mensagem */}
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={mensagem}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    disabled={desabilitado || enviando}
                    inputRef={inputRef}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'background.default',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                    borderWidth: 2
                                }
                            },
                            '&.Mui-focused': {
                                bgcolor: 'background.paper',
                                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                            }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                            transition: 'all 0.2s ease'
                        }
                    }}
                />

                {/* Botão Enviar / Áudio */}
                {mensagem.trim() ? (
                    <Fade in={true}>
                        <IconButton
                            onClick={handleEnviar}
                            disabled={desabilitado || enviando}
                            size="large"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                width: 56,
                                height: 56,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3d91 100%)',
                                    transform: 'scale(1.05)'
                                },
                                '&:active': {
                                    transform: 'scale(0.95)'
                                },
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Fade>
                ) : (
                    <Tooltip title="Mensagem de voz" arrow>
                        <IconButton
                            size="large"
                            sx={{
                                color: 'text.secondary',
                                width: 56,
                                height: 56,
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: 'primary.lighter',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <MicIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Aviso de chat desabilitado */}
            {desabilitado && (
                <Box
                    sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: 'warning.lighter',
                        borderRadius: 1,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="caption" color="warning.dark">
                        ⚠️ Este chat está fechado. Não é possível enviar mensagens.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default MessageInput;