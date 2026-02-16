import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { chatsAPI } from '../services/api';

const ChatList = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [novoChat, setNovoChat] = useState({
        gerenteId: '',
        assunto: 'duvidas',
        prioridade: 'media'
    });

    useEffect(() => {
        carregarChats();
    }, []);

    const carregarChats = async () => {
        setLoading(true);
        try {
            const { data } = await chatsAPI.listar();
            setChats(data.chats || []);
        } catch (error) {
            console.error('Erro ao carregar chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCriarChat = async () => {
        try {
            const { data } = await chatsAPI.criar(novoChat);
            setChats([data.chat, ...chats]);
            setDialogAberto(false);
            navigate(`/chats/${data.chat._id}`);
        } catch (error) {
            console.error('Erro ao criar chat:', error);
            alert(error.response?.data?.mensagem || 'Erro ao criar chat');
        }
    };

    const getStatusColor = (status) => {
        const cores = {
            aberto: 'warning',
            em_atendimento: 'info',
            fechado: 'success'
        };
        return cores[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const labels = {
            aberto: 'Aberto',
            em_atendimento: 'Em Atendimento',
            fechado: 'Fechado'
        };
        return labels[status] || status;
    };

    const formatarData = (data) => {
        const date = new Date(data);
        const hoje = new Date();
        
        if (date.toDateString() === hoje.toDateString()) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Box py={3}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                        <Typography variant="h4">
                            💬 Meus Chats
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Olá, {usuario?.nome}
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            onClick={logout}
                            sx={{ mr: 1 }}
                        >
                            Sair
                        </Button>
                        {usuario?.tipo === 'cliente' && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setDialogAberto(true)}
                            >
                                Novo Chat
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Lista de Chats */}
                <Paper>
                    {chats.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <ChatIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Nenhum chat encontrado
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Crie um novo chat para começar
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {chats.map((chat, index) => (
                                <React.Fragment key={chat._id}>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => navigate(`/chats/${chat._id}`)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {usuario?.tipo === 'cliente' 
                                                        ? chat.gerenteId?.nome?.[0]?.toUpperCase()
                                                        : chat.clienteId?.nome?.[0]?.toUpperCase()
                                                    }
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="subtitle1">
                                                            {usuario?.tipo === 'cliente'
                                                                ? chat.gerenteId?.nome || 'Gerente'
                                                                : chat.clienteId?.nome || 'Cliente'
                                                            }
                                                        </Typography>
                                                        <Chip
                                                            label={getStatusLabel(chat.status)}
                                                            color={getStatusColor(chat.status)}
                                                            size="small"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {chat.assunto} • {formatarData(chat.atualizadoEm)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < chats.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>

            {/* Dialog Novo Chat */}
            <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Iniciar Novo Chat</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="ID do Gerente"
                        value={novoChat.gerenteId}
                        onChange={(e) => setNovoChat({ ...novoChat, gerenteId: e.target.value })}
                        margin="normal"
                        helperText="Cole o ID do gerente"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Assunto</InputLabel>
                        <Select
                            value={novoChat.assunto}
                            onChange={(e) => setNovoChat({ ...novoChat, assunto: e.target.value })}
                            label="Assunto"
                        >
                            <MenuItem value="transacoes">Transações</MenuItem>
                            <MenuItem value="investimentos">Investimentos</MenuItem>
                            <MenuItem value="operacoes">Operações</MenuItem>
                            <MenuItem value="duvidas">Dúvidas</MenuItem>
                            <MenuItem value="outros">Outros</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Prioridade</InputLabel>
                        <Select
                            value={novoChat.prioridade}
                            onChange={(e) => setNovoChat({ ...novoChat, prioridade: e.target.value })}
                            label="Prioridade"
                        >
                            <MenuItem value="baixa">Baixa</MenuItem>
                            <MenuItem value="media">Média</MenuItem>
                            <MenuItem value="alta">Alta</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogAberto(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCriarChat}
                        variant="contained"
                        disabled={!novoChat.gerenteId}
                    >
                        Criar Chat
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ChatList;