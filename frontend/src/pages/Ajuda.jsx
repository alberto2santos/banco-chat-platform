import {
    Container,
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Help as HelpIcon,
    Chat as ChatIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

const Ajuda = () => {
    const faqs = [
        {
            pergunta: 'Como criar um novo chat?',
            resposta: 'Acesse "Meus Chats" e clique no botão "Novo Chat". Selecione um gerente disponível e informe o assunto do atendimento.'
        },
        {
            pergunta: 'Como enviar mensagens?',
            resposta: 'Abra o chat desejado e digite sua mensagem no campo de texto na parte inferior. As mensagens são enviadas em tempo real via WebSocket.'
        },
        {
            pergunta: 'Posso enviar arquivos?',
            resposta: 'Atualmente, o envio de arquivos está em desenvolvimento. Em breve você poderá enviar imagens e documentos.'
        },
        {
            pergunta: 'Como alterar minhas informações?',
            resposta: 'Acesse "Configurações" no menu lateral e atualize seus dados pessoais.'
        },
        {
            pergunta: 'As mensagens são seguras?',
            resposta: 'Sim! Todas as comunicações são criptografadas e armazenadas de forma segura no MongoDB Atlas.'
        }
    ];

    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h4" gutterBottom>
                    ❓ Ajuda
                </Typography>

                {/* Perguntas Frequentes */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        💡 Perguntas Frequentes
                    </Typography>

                    {faqs.map((faq, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{faq.pergunta}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography color="text.secondary">
                                    {faq.resposta}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>

                {/* Recursos */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        📚 Recursos
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <ChatIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Chat em Tempo Real"
                                secondary="Comunique-se instantaneamente com gerentes"
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Gerenciamento de Usuários"
                                secondary="Controle completo sobre clientes e gerentes"
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <SettingsIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Configurações Personalizadas"
                                secondary="Ajuste o sistema de acordo com suas necessidades"
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default Ajuda;