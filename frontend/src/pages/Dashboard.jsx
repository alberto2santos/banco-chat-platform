import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardActionArea,
    Avatar,
    Chip,
    Divider
} from '@mui/material';
import {
    Chat as ChatIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { chatsAPI } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [estatisticas, setEstatisticas] = useState({
        total: 0,
        abertos: 0,
        em_atendimento: 0,
        fechados: 0
    });
    const [chatsRecentes, setChatsRecentes] = useState([]);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const { data } = await chatsAPI.listar();
            const chats = data.chats || [];

            // Calcula estatísticas
            const stats = {
                total: chats.length,
                abertos: chats.filter(c => c.status === 'aberto').length,
                em_atendimento: chats.filter(c => c.status === 'em_atendimento').length,
                fechados: chats.filter(c => c.status === 'fechado').length
            };

            setEstatisticas(stats);
            setChatsRecentes(chats.slice(0, 5)); // Últimos 5 chats

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const cards = [
        {
            titulo: 'Total de Chats',
            valor: estatisticas.total,
            icone: <ChatIcon sx={{ fontSize: 40 }} />,
            cor: '#1976d2'
        },
        {
            titulo: 'Abertos',
            valor: estatisticas.abertos,
            icone: <ScheduleIcon sx={{ fontSize: 40 }} />,
            cor: '#ed6c02'
        },
        {
            titulo: 'Em Atendimento',
            valor: estatisticas.em_atendimento,
            icone: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            cor: '#0288d1'
        },
        {
            titulo: 'Finalizados',
            valor: estatisticas.fechados,
            icone: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            cor: '#2e7d32'
        }
    ];

    return (
        <Container maxWidth="lg">
            <Box py={4}>
                {/* Header */}
                <Box mb={4}>
                    <Typography variant="h4" gutterBottom>
                        📊 Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Bem-vindo(a), {usuario?.nome}
                    </Typography>
                </Box>

                {/* Cards de Estatísticas */}
                <Grid container spacing={3} mb={4}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    bgcolor: `${card.cor}10`
                                }}
                            >
                                <Box sx={{ color: card.cor, mb: 2 }}>
                                    {card.icone}
                                </Box>
                                <Typography variant="h3" fontWeight="bold" color={card.cor}>
                                    {card.valor}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    {card.titulo}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Chats Recentes */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        💬 Chats Recentes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {chatsRecentes.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <ChatIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography color="text.secondary">
                                Nenhum chat encontrado
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {chatsRecentes.map((chat) => (
                                <Grid item xs={12} key={chat._id}>
                                    <Card variant="outlined">
                                        <CardActionArea onClick={() => navigate(`/chats/${chat._id}`)}>
                                            <CardContent>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar>
                                                        {usuario?.tipo === 'cliente'
                                                            ? chat.gerenteId?.nome?.[0]?.toUpperCase()
                                                            : chat.clienteId?.nome?.[0]?.toUpperCase()
                                                        }
                                                    </Avatar>

                                                    <Box flex={1}>
                                                        <Typography variant="subtitle1" fontWeight="600">
                                                            {usuario?.tipo === 'cliente'
                                                                ? chat.gerenteId?.nome || 'Gerente'
                                                                : chat.clienteId?.nome || 'Cliente'
                                                            }
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {chat.assunto}
                                                        </Typography>
                                                    </Box>

                                                    <Chip
                                                        label={chat.status.replace('_', ' ')}
                                                        color={
                                                            chat.status === 'fechado' ? 'success' :
                                                            chat.status === 'em_atendimento' ? 'info' :
                                                            'warning'
                                                        }
                                                        size="small"
                                                    />
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Box textAlign="center" mt={3}>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => navigate('/chats')}
                        >
                            Ver todos os chats →
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;