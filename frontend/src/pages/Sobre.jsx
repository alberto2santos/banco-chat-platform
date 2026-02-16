import React from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Chip
} from '@mui/material';

const Sobre = () => {
    const tecnologias = [
        'React 18',
        'Node.js',
        'Express',
        'MongoDB Atlas',
        'Socket.io',
        'Material-UI',
        'JWT',
        'Docker'
    ];

    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h4" gutterBottom>
                    ℹ️ Sobre
                </Typography>

                {/* Sistema */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        🏦 Sistema de Comunicação Bancária
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                        Plataforma de comunicação em tempo real desenvolvida para facilitar
                        o atendimento entre clientes e gerentes bancários.
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Versão:</strong> 1.0.0
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        <strong>Desenvolvido em:</strong> Janeiro 2025
                    </Typography>
                </Paper>

                {/* Tecnologias */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        🛠️ Tecnologias
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tecnologias.map((tech, index) => (
                            <Chip
                                key={index}
                                label={tech}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Paper>

                {/* Funcionalidades */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        ✨ Funcionalidades
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" gutterBottom>
                                ✅ Autenticação JWT
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ✅ Chat em Tempo Real
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ✅ Notificações
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ✅ Rate Limiting
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" gutterBottom>
                                ✅ Documentação Swagger
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ✅ MongoDB Atlas
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ✅ Docker Support
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ✅ Responsive Design
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default Sobre;