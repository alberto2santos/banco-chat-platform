import { Container, Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Contatos = () => {
    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h4" gutterBottom>
                    📞 Contatos
                </Typography>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Entre em contato conosco
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Email color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Email"
                                secondary="contato@banco.com"
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <Phone color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Telefone"
                                secondary="(11) 1234-5678"
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <LocationOn color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Endereço"
                                secondary="Av. Paulista, 1000 - São Paulo, SP"
                            />
                        </ListItem>
                    </List>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Horário de atendimento: Segunda a Sexta, das 9h às 18h
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Contatos;