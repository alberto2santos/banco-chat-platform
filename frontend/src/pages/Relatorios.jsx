import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import {
    Chat as ChatIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const Relatorios = () => {
    const estatisticas = [
        { titulo: 'Total de Chats', valor: '0', icone: <ChatIcon />, cor: '#1976d2' },
        { titulo: 'Chats Ativos', valor: '0', icone: <TrendingUpIcon />, cor: '#0288d1' },
        { titulo: 'Finalizados', valor: '0', icone: <CheckCircleIcon />, cor: '#2e7d32' },
        { titulo: 'Usuários', valor: '0', icone: <PeopleIcon />, cor: '#ed6c02' }
    ];

    return (
        <Container maxWidth="lg">
            <Box py={4}>
                <Typography variant="h4" gutterBottom>
                    📊 Relatórios
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                    Página em construção - Estatísticas e relatórios estarão disponíveis em breve.
                </Typography>

                <Grid container spacing={3}>
                    {estatisticas.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    bgcolor: `${stat.cor}10`
                                }}
                            >
                                <Box sx={{ color: stat.cor, mb: 2, fontSize: 40 }}>
                                    {stat.icone}
                                </Box>
                                <Typography variant="h3" fontWeight="bold" color={stat.cor}>
                                    {stat.valor}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    {stat.titulo}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Relatorios;